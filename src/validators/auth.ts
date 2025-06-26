// validators/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum")
});

export const signupSchema = loginSchema.extend({
  // Ajoutez des champs supplémentaires si besoin
});