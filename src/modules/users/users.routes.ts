import { Router } from "express";
import { auth_admin } from "../../middleware/auth_admin";
import { list_users_handler } from "./users.controller";

const router = Router();

router.get("/", auth_admin, list_users_handler);

export default router;
