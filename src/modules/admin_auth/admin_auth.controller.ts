import { Request, Response } from "express";
import { admin_login_schema } from "./admin_auth.schemas";
import { admin_login } from "./admin_auth.service";

/**
 * @openapi
 * /api/admin/auth/login:
 *   post:
 *     tags: [AdminAuth]
 *     summary: Admin login (separate auth)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@example.com }
 *               password: { type: string, example: admin12345 }
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
export const admin_login_handler = async (req: Request, res: Response) => {
  const parsed = admin_login_schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  const result = await admin_login(parsed.data.email, parsed.data.password);
  if (!result) return res.status(401).json({ message: "Invalid credentials" });

  return res.json(result);
};
