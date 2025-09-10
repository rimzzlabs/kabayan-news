import z from "zod";

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export const createCategorySchema = z.object({
  name: z.string().min(5, "Minimal 5 karakter").max(30, "Maksimal 30 karakter"),
  description: z
    .string()
    .min(10, "Minimal 10 karakter")
    .max(100, "Maksimal 100 karakter"),
  type: z.enum(["berita", "aspirasi"], "Pilih jenis kategori"),
});

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export const updateCategorySchema = z.object({
  id: z.string().min(1, "Tidak ada ID kategori"),
  name: z.string().min(5, "Minimal 5 karakter").max(30, "Maksimal 30 karakter"),
  description: z
    .string()
    .min(10, "Minimal 10 karakter")
    .max(100, "Maksimal 100 karakter"),
  type: z.enum(["berita", "aspirasi"], "Pilih jenis kategori"),
});
