import { NextFunction, Request, Response } from "express";
import { verify_admin_token } from "../utils/jwt";

export type AdminAuthedRequest = Request & { admin_id?: number };

export const auth_admin = (req: AdminAuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Admin token required" });
  }

  try {
    const payload = verify_admin_token(token);
    req.admin_id = payload.admin_id;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};
