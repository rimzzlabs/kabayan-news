/** biome-ignore-all lint/correctness/noUnusedVariables: d.ts file */
type Aspiration = {
  id: string;
  foto_url: string | null;
  judul: string;
  deskripsi: string;
  slug: string;
  tanggal_kirim: string | null;
  status: string | null;
  user_id: string | null;
  kategori: {
    id: string;
    nama: string;
  } | null;
  komentar: Array<{
    id: string;
    isi: string | null;
    tanggal_komentar: string | null;
    user: {
      id: string;
      nama: string | null;
      foto_profil: string | null;
    } | null;
  }>;
};
