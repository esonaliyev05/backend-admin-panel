import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { auth_admin } from "../../middleware/auth_admin";
import { upload } from "../_upload";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/**
 * @openapi
 * /api/blog:
 *   get:
 *     tags: [WebsiteBlog]
 *     summary: List blog posts (public)
 *     responses:
 *       200:
 *         description: OK
 */
export const list_posts = async (_req: Request, res: Response) => {
  const posts = await prisma.blogPost.findMany({
    where: { is_active: true },
    orderBy: { created_at: "desc" }
  });
  return res.json({ results: posts });
};

/**
 * @openapi
 * /api/blog/{slug}:
 *   get:
 *     tags: [WebsiteBlog]
 *     summary: Blog post detail (public)
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
export const post_detail = async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const post = await prisma.blogPost.findFirst({ where: { slug, is_active: true } });
  if (!post) return res.status(404).json({ message: "Not found" });
  return res.json(post);
};

/**
 * @openapi
 * /api/blog/admin:
 *   post:
 *     tags: [AdminBlog]
 *     summary: Create blog post (admin)
 *     security:
 *       - AdminBearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *               slug: { type: string }
 *               is_active: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const create_post = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const title = String(req.body.title ?? "").trim();
    const content = String(req.body.content ?? "").trim();
    if (!title || !content) return res.status(400).json({ message: "title and content required" });

    const raw_slug = String(req.body.slug ?? "").trim();
    const slug = raw_slug ? slugify(raw_slug) : slugify(title);

    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        is_active: req.body.is_active !== undefined ? String(req.body.is_active) === "true" : true,
        image_url
      }
    });

    return res.json(created);
  }
];

/**
 * @openapi
 * /api/blog/admin/{id}:
 *   patch:
 *     tags: [AdminBlog]
 *     summary: Update blog post (admin)
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
 *               content: { type: string }
 *               slug: { type: string }
 *               is_active: { type: boolean }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: OK
 */
export const update_post = [
  auth_admin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const exists = await prisma.blogPost.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ message: "Not found" });

    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const next_title = req.body.title !== undefined ? String(req.body.title).trim() : undefined;
    const next_content = req.body.content !== undefined ? String(req.body.content).trim() : undefined;
    const next_slug = req.body.slug !== undefined ? slugify(String(req.body.slug)) : undefined;

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: next_title,
        content: next_content,
        slug: next_slug,
        is_active: req.body.is_active !== undefined ? String(req.body.is_active) === "true" : undefined,
        image_url: image_url ?? undefined
      }
    });

    return res.json(updated);
  }
];

/**
 * @openapi
 * /api/blog/admin/{id}:
 *   delete:
 *     tags: [AdminBlog]
 *     summary: Delete blog post (admin)
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
export const delete_post = [
  auth_admin,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.blogPost.delete({ where: { id } });
    return res.json({ ok: true });
  }
];
