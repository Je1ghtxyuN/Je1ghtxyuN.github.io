export function loadRuntimeConfig() {
  return {
    port: process.env.PORT || "3001",
    databaseUrl: process.env.DATABASE_URL || "",
    sessionSecret: process.env.SESSION_SECRET || "",
  };
}
