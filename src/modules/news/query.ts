import { toInt } from "radash";
import type { SupabaseServerClient } from "../supabase/server";

export async function getServerNews(
  client: SupabaseServerClient,
  options?: QueryOptions,
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  if (options?.userId) {
    let res = await client
      .from("berita")
      .select(
        `id, foto_url, judul, isi, slug, tanggal_publikasi, tanggal_dibuat,
         kategori (id, nama),
         komentar (id, isi, tanggal_komentar,
         user: profiles ( id, nama, foto_profil )
         )
        `,
        {
          count: "exact",
        },
      )
      .eq("status", "published")
      .eq("user_id", options.userId)
      .order("tanggal_publikasi", { ascending: false })
      .range(from, to);

    return res.data ?? [];
  }

  let res = await client
    .from("berita")
    .select(
      `id, foto_url, judul, isi, slug, tanggal_publikasi, tanggal_dibuat,
       kategori (id, nama),
       komentar (id, isi, tanggal_komentar,
       user: profiles ( id, nama, foto_profil )
       )
      `,
      {
        count: "exact",
      },
    )
    .eq("status", "published")
    .order("tanggal_publikasi", { ascending: false })
    .range(from, to);

  return res.data ?? [];
}

export async function getServerNewsDetail(
  client: SupabaseServerClient,
  slug: string,
) {
  // query the news, komentar only show counts
  let newsQuery = await client
    .from("berita")
    .select(
      `id, foto_url, judul, isi, slug, tanggal_publikasi, tanggal_dibuat,
       kategori (id, nama)
      `,
      {
        count: "exact",
      },
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

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
