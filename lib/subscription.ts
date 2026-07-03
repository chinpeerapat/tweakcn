"use server";

import { getMyAllTimeRequestCount } from "@/actions/ai-usage";
import { SubscriptionRequiredError } from "@/types/errors";
import { SubscriptionCheck } from "@/types/subscription";
import { NextRequest } from "next/server";
import { AI_REQUEST_FREE_TIER_LIMIT } from "./constants";
import { getCurrentUserId } from "./shared";
import { db } from "@/db";
import { subscription, user as userTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const UNLIMITED_REQUESTS_REMAINING = Number.MAX_SAFE_INTEGER;

function getOwnerEmails(): Set<string> {
  const raw = process.env.TWEAKCN_OWNER_EMAILS ?? process.env.TWEAKCN_OWNER_EMAIL ?? "";

  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function isOwnerUser(userId: string): Promise<boolean> {
  const ownerEmails = getOwnerEmails();

  if (ownerEmails.size === 0) return false;

  const [currentUser] = await db
    .select({ email: userTable.email })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);

  return currentUser ? ownerEmails.has(currentUser.email.toLowerCase()) : false;
}

export async function getMyActiveSubscription(
  userId: string
): Promise<typeof subscription.$inferSelect | null> {
  const sub = await db
    .select()
    .from(subscription)
    .where(and(eq(subscription.userId, userId), eq(subscription.status, "active")));
  return sub[0];
}

export async function hasProEntitlement(userId: string): Promise<boolean> {
  const [activeSubscription, ownerUser] = await Promise.all([
    getMyActiveSubscription(userId),
    isOwnerUser(userId),
  ]);

  const hasActiveSubscription =
    !!activeSubscription &&
    activeSubscription?.productId === process.env.NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID;

  return ownerUser || hasActiveSubscription;
}

export async function validateSubscriptionAndUsage(userId: string): Promise<SubscriptionCheck> {
  try {
    const [activeSubscription, ownerUser, requestsUsed] = await Promise.all([
      getMyActiveSubscription(userId),
      isOwnerUser(userId),
      getMyAllTimeRequestCount(userId),
    ]);

    const isSubscribed =
      !!activeSubscription &&
      activeSubscription?.productId === process.env.NEXT_PUBLIC_TWEAKCN_PRO_PRODUCT_ID;

    if (ownerUser || isSubscribed) {
      return {
        canProceed: true,
        isSubscribed: true,
        isBillingManaged: isSubscribed,
        requestsUsed,
        requestsRemaining: UNLIMITED_REQUESTS_REMAINING,
      };
    }

    const requestsRemaining = Math.max(0, AI_REQUEST_FREE_TIER_LIMIT - requestsUsed);
    const canProceed = requestsUsed < AI_REQUEST_FREE_TIER_LIMIT;

    if (!canProceed) {
      return {
        canProceed: false,
        isSubscribed: false,
        requestsUsed,
        requestsRemaining: 0,
        error: `You've reached your free limit of ${AI_REQUEST_FREE_TIER_LIMIT} requests. Please upgrade to continue.`,
      };
    }

    return {
      canProceed: true,
      isSubscribed: false,
      isBillingManaged: false,
      requestsUsed,
      requestsRemaining,
    };
  } catch (error) {
    console.error("Error validating subscription:", error);
    throw error;
  }
}

export async function requireSubscriptionOrFreeUsage(req: NextRequest): Promise<void> {
  const userId = await getCurrentUserId(req);
  const validation = await validateSubscriptionAndUsage(userId);

  if (!validation.canProceed) {
    throw new SubscriptionRequiredError(validation.error, {
      requestsRemaining: validation.requestsRemaining,
    });
  }
}
