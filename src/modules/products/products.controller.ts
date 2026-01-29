import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { auth_admin } from "../../middleware/auth_admin";
import { upload } from "../_upload";
import { product_create_schema, product_update_schema } from "./products.schemas";

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags: [WebsiteProducts]
 *     summary: List products (public website)
 *     responses:
 *       200:
 *         description: OK
 */
export const list_products = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { is_active: true },
    orderBy: { created_at: "desc" }
  });
  return res.json({ results: products });
};

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags: [WebsiteProducts]
 *     summary: Product detail (public)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
export const product_detail = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findFirst({ where: { id, is_active: true } });
  if (!product) return res.status(404).json({ message: "Not found" });
  return res.json(product);
};

/**
 * @openapi
 * /api/products/admin:
 *   post:
 *     tags: [AdminProducts]
 *     summary: Create product (admin)
 *     security:
 *       - AdminBearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: integer }
 *               category: { type: string }
 *               is_active: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const create_product = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const body = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      category: req.body.category,
      is_active: req.body.is_active !== undefined ? String(req.body.is_active) === "true" : undefined
    };

    const parsed = product_create_schema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await prisma.product.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        price: parsed.data.price ?? 0,
        category: parsed.data.category ?? null,
        is_active: parsed.data.is_active ?? true,
        image_url
      }
    });

    return res.json(created);
  }
];

/**
 * @openapi
 * /api/products/admin/{id}:
 *   patch:
 *     tags: [AdminProducts]
 *     summary: Update product (admin)
 *     security:
 *       - AdminBearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: integer }
 *               category: { type: string }
 *               is_active: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const update_product = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const exists = await prisma.product.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: "Not found" });

    const body = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      category: req.body.category,
      is_active: req.body.is_active !== undefined ? String(req.body.is_active) === "true" : undefined
    };

    const parsed = product_update_schema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
    }

    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        description: parsed.data.description ?? undefined,
        category: parsed.data.category ?? undefined,
        image_url: image_url ?? undefined
      }
    });

    return res.json(updated);
  }
];

/**
 * @openapi
 * /api/products/admin/{id}:
 *   delete:
 *     tags: [AdminProducts]
 *     summary: Delete product (admin)
 *     security:
 *       - AdminBearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 */
export const delete_product = [
  auth_admin,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    return res.json({ ok: true });
  }
];
