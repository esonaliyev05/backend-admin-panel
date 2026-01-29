import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import path from "path";

import { config } from "./config";
import { swagger_spec } from "./swagger";
import { error_handler } from "./middleware/error";

import admin_auth_routes from "./modules/admin_auth/admin_auth.routes";
import auth_routes from "./modules/auth/auth.routes";
import users_routes from "./modules/users/users.routes";
import products_routes from "./modules/products/products.routes";
import banners_routes from "./modules/banners/banners.routes";
import blog_routes from "./modules/blog/blog.routes";
import about_routes from "./modules/about/about.routes";

export const create_app = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.cors_origin === "*" ? true : config.cors_origin }));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Static uploads
  const uploads_dir = path.join(process.cwd(), "uploads");
  app.use("/uploads", express.static(uploads_dir));

  // Swagger
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swagger_spec));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Routes
  app.use("/api/admin/auth", admin_auth_routes);
  app.use("/api/auth", auth_routes);

  app.use("/api/admin/users", users_routes);

  app.use("/api/products", products_routes);
  app.use("/api/banners", banners_routes);
  app.use("/api/blog", blog_routes);
  app.use("/api/about", about_routes);

  app.use(error_handler);

  return app;
};
