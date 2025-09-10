import { toInt } from "radash";
import type { SupabaseServerClient } from "../supabase/server";

export async function getServerNews(
  client: SupabaseServerClient,
  options?: QueryOptions & { status?: "published" | "draft" },
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let query = client
    .from("berita")
    .select(
      `id, foto_url, judul, isi, slug, tanggal_publikasi, tanggal_dibuat, status,
         kategori (id, nama),
         komentar (id, isi, tanggal_komentar,
         user: profiles ( id, nama, foto_profil )
         )
        `,
      {
        count: "exact",
      },
    )
    .order("tanggal_publikasi", { ascending: false })
    .range(from, to);

  if (options?.status) {
    query = query.eq("status", options.status);
  }
  if (options?.userId) {
    query = query.eq("user_id", options.userId);
  }

  return await query;
}

export async function getServerNewsDetail(
  client: SupabaseServerClient,
  options: { slug: string; status?: "published" | "draft" },
) {
  // query the news, komentar only show counts
  let query = client
    .from("berita")
    .select(
      `id, foto_url, judul, isi, slug, tanggal_publikasi, tanggal_dibuat, status,
       kategori (id, nama)
      `,
      {
        count: "exact",
      },
    )
    .eq("slug", options.slug);

  if (options.status) {
    query = query.eq("status", options.status);
  }

  let newsQuery = await query.maybeSingle();

  if (!newsQuery.data) return null;

  let commentsQuery = await client
    .from("komentar")
    .select(
      `id, isi, tanggal_komentar,
       user: profiles ( id, nama, foto_profil )
      `,
      {
        count: "exact",
      },
    )
    .eq("berita_id", newsQuery.data.id)
    .order("tanggal_komentar", { ascending: false });

  return { ...newsQuery.data, commentsCount: commentsQuery.count ?? 0 };
}
