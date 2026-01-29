import { Router } from "express";
import { login_handler, register_handler } from "./auth.controller";

const router = Router();

router.post("/register", register_handler);
router.post("/login", login_handler);

export default router;
