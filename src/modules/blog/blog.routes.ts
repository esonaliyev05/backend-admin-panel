import { Router } from "express";
import { create_post, delete_post, list_posts, post_detail, update_post } from "./blog.controller";

const router = Router();

router.get("/", list_posts);
router.get("/:slug", post_detail);

// admin
router.post("/admin", ...create_post as any);
router.patch("/admin/:id", ...update_post as any);
router.delete("/admin/:id", ...delete_post as any);

export default router;
