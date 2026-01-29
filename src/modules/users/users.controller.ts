import { Response } from "express";
import { prisma } from "../../prisma";
import { AdminAuthedRequest } from "../../middleware/auth_admin";

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [AdminUsers]
 *     summary: List website users (admin only)
 *     security:
 *       - AdminBearer: []
 *     responses:
 *       200:
 *         description: OK
 */
export const list_users_handler = async (_req: AdminAuthedRequest, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { created_at: "desc" },
    select: { id: true, email: true, full_name: true, created_at: true }
  });
  return res.json({ results: users });
};
