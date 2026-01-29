import { Request, Response } from "express";
import { user_login_schema, user_register_schema } from "./auth.schemas";
import { user_login, user_register } from "./auth.service";

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [WebsiteAuth]
 *     summary: Website user register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: user12345 }
 *               full_name: { type: string, example: "Ali Valiyev" }
 *     responses:
 *       200:
 *         description: OK
 */
export const register_handler = async (req: Request, res: Response) => {
  const parsed = user_register_schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  const result = await user_register(parsed.data.email, parsed.data.password, parsed.data.full_name);
  if (!result.ok) return res.status(409).json({ message: "Email already exists" });

  return res.json(result);
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [WebsiteAuth]
 *     summary: Website user login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: user12345 }
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
export const login_handler = async (req: Request, res: Response) => {
  const parsed = user_login_schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation error", errors: parsed.error.flatten() });
  }

  const result = await user_login(parsed.data.email, parsed.data.password);
  if (!result) return res.status(401).json({ message: "Invalid credentials" });

  return res.json(result);
};
