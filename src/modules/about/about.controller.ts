import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { auth_admin } from "../../middleware/auth_admin";
import { upload } from "../_upload";

/**
 * @openapi
 * /api/about:
 *   get:
 *     tags: [WebsiteAbout]
 *     summary: Get about content (public)
 *     responses:
 *       200:
 *         description: OK
 */
export const get_about = async (_req: Request, res: Response) => {
  const about = await prisma.about.findUnique({ where: { id: 1 } });
  return res.json(about ?? { id: 1, title: null, content: null, image_url: null });
};

/**
 * @openapi
 * /api/about/admin:
 *   put:
 *     tags: [AdminAbout]
 *     summary: Upsert about (admin)
 *     security:
 *       - AdminBearer: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const upsert_about = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const about = await prisma.about.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        title: req.body.title ?? null,
        content: req.body.content ?? null,
        image_url: image_url ?? null
      },
      update: {
        title: req.body.title ?? undefined,
        content: req.body.content ?? undefined,
        image_url: image_url ?? undefined
      }
    });

    return res.json(about);
  }
];
