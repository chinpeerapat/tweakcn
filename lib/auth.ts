import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

function resolveBaseURL() {
  const envBaseURL = process.env.BASE_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();
  const fallbackBaseURL = vercelUrl
    ? vercelUrl.startsWith("http")
      ? vercelUrl
      : `https://${vercelUrl}`
    : "http://localhost:3000";

  const candidate = envBaseURL && envBaseURL.length > 0 ? envBaseURL : fallbackBaseURL;

  try {
    const url = new URL(candidate);
    // Normalise by trimming a trailing slash so downstream comparisons stay consistent.
    const formatted = url.toString().replace(/\/$/, "");
    return { baseURL: formatted, origin: url.origin };
  } catch {
    return { baseURL: candidate, origin: candidate };
  }
}

const { baseURL, origin } = resolveBaseURL();

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [origin],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
