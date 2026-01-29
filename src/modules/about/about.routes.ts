import { Router } from "express";
import { get_about, upsert_about } from "./about.controller";

const router = Router();

router.get("/", get_about);
router.put("/admin", ...upsert_about as any);

export default router;
