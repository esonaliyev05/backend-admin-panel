import { Router } from "express";
import { create_product, delete_product, list_products, product_detail, update_product } from "./products.controller";

const router = Router();

router.get("/", list_products);
router.get("/:id", product_detail);

// admin
router.post("/admin", ...create_product as any);
router.patch("/admin/:id", ...update_product as any);
router.delete("/admin/:id", ...delete_product as any);

export default router;
