/** biome-ignore-all lint/correctness/noUnusedVariables: d.ts file */
type News = {
  id: string;
  judul: string;
  foto_url: string | null;
  isi: string | null;
  slug: string;
  tanggal_publikasi: string | null;
  tanggal_dibuat: string;
  status: string | null;
  kategori: {
    id: string;
    nama: string;
  } | null;
  komentar: {
    id: string;
    isi: string | null;
    tanggal_komentar: string | null;
    user: {
      id: string;
      nama: string | null;
      foto_profil: string | null;
    } | null;
  }[];
};

type NewsComment = {
  id: string;
  isi: string | null;
  tanggal_komentar: string | null;
  profiles: {
    id: string;
    nama: string | null;
    foto_profil: string | null;
  } | null;
};
