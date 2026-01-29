import jwt from "jsonwebtoken";
import { config } from "../config";

export type AdminJwtPayload = { admin_id: number; type: "admin" };
export type UserJwtPayload = { user_id: number; type: "user" };

export const sign_admin_token = (admin_id: number) => {
  const payload: AdminJwtPayload = { admin_id, type: "admin" };
  return jwt.sign(payload, config.jwt_admin_secret, { expiresIn: config.jwt_expires_in });
};

export const sign_user_token = (user_id: number) => {
  const payload: UserJwtPayload = { user_id, type: "user" };
  return jwt.sign(payload, config.jwt_user_secret, { expiresIn: config.jwt_expires_in });
};

export const verify_admin_token = (token: string) => {
  return jwt.verify(token, config.jwt_admin_secret) as AdminJwtPayload;
};

export const verify_user_token = (token: string) => {
  return jwt.verify(token, config.jwt_user_secret) as UserJwtPayload;
};
