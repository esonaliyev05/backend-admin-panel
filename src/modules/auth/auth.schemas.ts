import { z } from "zod";

export const user_register_schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  full_name: z.string().min(2).optional()
});

export const user_login_schema = z.object({
  email: z.string().email(),
  password: z.string().min(5)
});
