import z from "zod";

// ─── Schéma GET — body ────────────────────────────────────────────────────

export const GetCategorySchema = z.object({
  id: z.string().regex(/^\d+$/, "id doit être un entier positif").transform(Number),
});              