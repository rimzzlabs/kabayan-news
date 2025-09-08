import z from "zod";

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
export const createCommentSchema = z.object({
  userId: z.string().min(1, "Tidak ada user ID"),
  newsId: z.string().min(1, "Tidak ada news ID"),
  newsType: z.enum(["berita", "aspirasi"]),
  comment: z
    .string()
    .min(1, "Masukan komentar anda")
    .min(10, "Minimal 10 karakter")
    .max(1000, "Maksimal 1000 karakter"),
});
