import { z } from "zod";

export const product_create_schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().int().nonnegative().optional(),
  category: z.string().optional(),
  is_active: z.boolean().optional()
});

export const product_update_schema = product_create_schema.partial();
