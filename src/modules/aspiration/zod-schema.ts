import z from "zod";

export type CreateAspirationSchema = z.infer<typeof createAspirationSchema>;
export const createAspirationSchema = z.object({
  title: z
    .string()
    .min(1, "Masukan judul aspirasi anda")
    .min(10, "Minimal 10 karakter")
    .max(100, "Judul aspirasi maksimal 100 karakter"),
  description: z
    .string()
    .min(1, "Masukan deskripsi aspirasi anda")
    .min(20, "Minimal 20 karakter")
    .max(1000, "Maksimal 1000 karakter"),
  category: z.string().min(1, "Pilih kategori aspirasi"),
  imgUrl: z.string().optional(),
});
