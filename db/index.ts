import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

const missingConnectionError = () =>
  new Error(
    "DATABASE_URL environment variable is not configured. Database queries cannot be executed."
  );

if (!connectionString && process.env.NODE_ENV !== "production") {
  console.warn(
    "DATABASE_URL is not set. Database operations will throw if invoked. Configure the variable to enable persistence."
  );
}

export const db = connectionString
  ? drizzle({ client: neon(connectionString) })
  : (new Proxy(
      {},
      {
        get() {
          throw missingConnectionError();
        },
        apply() {
          throw missingConnectionError();
        },
      }
    ) as ReturnType<typeof drizzle>);
