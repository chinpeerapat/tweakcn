import { AI_REQUEST_FREE_TIER_LIMIT } from "@/lib/constants";

type Feature = {
  description: string;
  status: "done" | "pending";
};

export const FREE_SUB_FEATURES: Feature[] = [
  { description: `${AI_REQUEST_FREE_TIER_LIMIT} AI chat responses each month`, status: "done" },
  { description: "Authentication with passwordless email", status: "done" },
  { description: "Usage dashboard with daily metrics", status: "done" },
];

export const PRO_SUB_FEATURES: Feature[] = [
  { description: "Unlimited AI chat responses", status: "done" },
  { description: "Team seats and shared history", status: "pending" },
  { description: "Advanced usage analytics exports", status: "pending" },
  { description: "Priority product support", status: "done" },
];
