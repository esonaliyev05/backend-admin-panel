import { NextFunction, Request, Response } from "express";
import { verify_user_token } from "../utils/jwt";

export type UserAuthedRequest = Request & { user_id?: number };

export const auth_user = (req: UserAuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "User token required" });
  }

  try {
    const payload = verify_user_token(token);
    req.user_id = payload.user_id;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid user token" });
  }
};
