import { prisma } from "../../prisma";
import { hash_password, verify_password } from "../../utils/password";
import { sign_user_token } from "../../utils/jwt";

export const user_register = async (email: string, password: string, full_name?: string) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { ok: false as const, reason: "EMAIL_EXISTS" as const };

  const password_hash = await hash_password(password);
  const user = await prisma.user.create({
    data: { email, password_hash, full_name: full_name ?? null }
  });

  const token = sign_user_token(user.id);
  return { ok: true as const, token, user: { id: user.id, email: user.email, full_name: user.full_name } };
};

export const user_login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const ok = await verify_password(password, user.password_hash);
  if (!ok) return null;

  const token = sign_user_token(user.id);
  return { token, user: { id: user.id, email: user.email, full_name: user.full_name } };
};
