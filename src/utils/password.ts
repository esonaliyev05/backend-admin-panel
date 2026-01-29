import bcrypt from "bcryptjs";

export const hash_password = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verify_password = async (password: string, password_hash: string) => {
  return bcrypt.compare(password, password_hash);
};
