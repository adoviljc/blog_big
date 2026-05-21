// lib/schemas/post.schema.ts
import { z } from "zod";

// ─── Schéma GET — query params ─────────────────────────────────────────────

export const GetPostsQuerySchema = z.object({
  published: z
    .enum(["true", "false"])
    .optional(),

  categoryId: z
    .string()
    .regex(/^\d+$/, "categoryId doit être un entier positif")
    .transform(Number)
    .optional(),
});

export type GetPostsQuery = z.infer<typeof GetPostsQuerySchema>;

// ─── Schéma POST — body ────────────────────────────────────────────────────

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre ne peut pas être vide")
    .max(200, "Le titre ne dépasse pas 200 caractères")
    .trim(),

  slug: z
    .string()
    .min(1, "Le slug ne peut pas être vide")
    .max(220, "Le slug ne dépasse pas 220 caractères")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des minuscules, chiffres et tirets"
    ),

  content: z
    .string()
    .min(1, "Le contenu ne peut pas être vide"),

  excerpt: z
    .string()
    .max(500, "L'extrait ne dépasse pas 500 caractères")
    .trim()
    .optional(),

  published: z.boolean().default(false),

  userId: z
    .string()
    .min(1, "userId ne peut pas être vide"),

  categoryId: z
    .number()
    .int("categoryId doit être un entier")
    .positive("categoryId doit être positif"),

  tagIds: z
    .array(
      z.number()
        .int("Chaque tagId doit être un entier")
        .positive("Chaque tagId doit être positif")
    )
    .default([]),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;