import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase
 } from "drizzle-orm/postgres-js";

const setup = () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return {
      select: () => ({
        from: () => Promise.resolve([]),
      }),
      insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    };
  }

  // for query purposes
  const queryClient = postgres(process.env.DATABASE_URL, {
    max: 5, // set connection pool size to 5
    idle_timeout: 60, // close idle clients after 60 seconds
  });
  const db: PostgresJsDatabase = drizzle(queryClient);
  return db;
};

export default setup();
