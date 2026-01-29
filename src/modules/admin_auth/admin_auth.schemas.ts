import { z } from "zod";

export const admin_login_schema = z.object({
  email: z.string().email(),
  password: z.string().min(5)
});
