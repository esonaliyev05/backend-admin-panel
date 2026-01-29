import { Router } from "express";
import { admin_login_handler } from "./admin_auth.controller";

const router = Router();

router.post("/login", admin_login_handler);

export default router;
