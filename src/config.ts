import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 5000),
  node_env: process.env.NODE_ENV ?? "development",
  cors_origin: process.env.CORS_ORIGIN ?? "*",

  database_url: process.env.DATABASE_URL ?? "",

  jwt_admin_secret: process.env.JWT_ADMIN_SECRET ?? "change_me_admin_secret",
  jwt_user_secret: process.env.JWT_USER_SECRET ?? "change_me_user_secret",
  jwt_expires_in: process.env.JWT_EXPIRES_IN ?? "7d",

  seed_admin_email: process.env.SEED_ADMIN_EMAIL ?? "admin@example.com",
  seed_admin_password: process.env.SEED_ADMIN_PASSWORD ?? "admin12345",
};
