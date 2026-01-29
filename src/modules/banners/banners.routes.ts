import { Router } from "express";
import { create_banner, delete_banner, list_banners, update_banner } from "./banners.controller";

const router = Router();

router.get("/", list_banners);

// admin
router.post("/admin", ...create_banner as any);
router.patch("/admin/:id", ...update_banner as any);
router.delete("/admin/:id", ...delete_banner as any);

export default router;
