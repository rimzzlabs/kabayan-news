import { toInt } from "radash";
import type { SupabaseServerClient } from "../supabase/server";

export async function getServerAspirations(
  client: SupabaseServerClient,
  options?: QueryOptions,
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let query = client
    .from("aspirasi")
    .select(
      `id, foto_url, judul, deskripsi, slug, tanggal_kirim, status, user_id,
         kategori (id, nama),
         komentar (id, isi, tanggal_komentar,
         user: profiles ( id, nama, foto_profil )
         )
        `,
      {
        count: "exact",
      },
    )
    .range(from, to)
    .order("tanggal_kirim", { ascending: false });

  if (options?.userId) {
    query = query.eq("user_id", options.userId);
  }

  return await query;
}

export async function getServerAspirationDetail(
  client: SupabaseServerClient,
  slug: string,
) {
  // query the news, komentar only show counts
  let newsQuery = await client
    .from("aspirasi")
    .select(
      `id, foto_url, judul, deskripsi, slug, tanggal_kirim, status, user_id,
       kategori (id, nama)
      `,
      {
        count: "exact",
      },
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!newsQuery.data) return null;

  let commentsQuery = await client
    .from("komentar")
    .select("id, isi, tanggal_komentar", {
      count: "exact",
    })
    .eq("aspirasi_id", newsQuery.data.id);

  return { ...newsQuery.data, commentsCount: commentsQuery.count ?? 0 };
}
