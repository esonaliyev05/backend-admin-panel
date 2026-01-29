import { prisma } from "../../prisma";
import { verify_password } from "../../utils/password";
import { sign_admin_token } from "../../utils/jwt";

export const admin_login = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const ok = await verify_password(password, admin.password_hash);
  if (!ok) return null;

  const token = sign_admin_token(admin.id);
  return { token, admin: { id: admin.id, email: admin.email } };
};
