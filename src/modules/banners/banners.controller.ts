import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { auth_admin } from "../../middleware/auth_admin";
import { upload } from "../_upload";

/**
 * @openapi
 * /api/banners:
 *   get:
 *     tags: [WebsiteBanners]
 *     summary: List banners (public)
 *     responses:
 *       200:
 *         description: OK
 */
export const list_banners = async (_req: Request, res: Response) => {
  const banners = await prisma.banner.findMany({
    where: { is_active: true },
    orderBy: { created_at: "desc" }
  });
  return res.json({ results: banners });
};

/**
 * @openapi
 * /api/banners/admin:
 *   post:
 *     tags: [AdminBanners]
 *     summary: Create banner (image + text) (admin)
 *     security:
 *       - AdminBearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               text: { type: string }
 *               is_active: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const create_banner = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await prisma.banner.create({
      data: {
        title: req.body.title ?? null,
        text: req.body.text ?? null,
        is_active: req.body.is_active !== undefined ? String(req.body.is_active) === "true" : true,
        image_url
      }
    });

    return res.json(created);
  }
];

/**
 * @openapi
 * /api/banners/admin/{id}:
 *   patch:
 *     tags: [AdminBanners]
 *     summary: Update banner (admin)
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
 *               text: { type: string }
 *               is_active: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const update_banner = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const exists = await prisma.banner.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: "Not found" });

    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: req.body.title ?? undefined,
        text: req.body.text ?? undefined,
        is_active: req.body.is_active !== undefined ? String(req.body.is_active) === "true" : undefined,
        image_url: image_url ?? undefined
      }
    });

    return res.json(updated);
  }
];

/**
 * @openapi
 * /api/banners/admin/{id}:
 *   delete:
 *     tags: [AdminBanners]
 *     summary: Delete banner (admin)
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
export const delete_banner = [
  auth_admin,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.banner.delete({ where: { id } });
    return res.json({ ok: true });
  }
];
