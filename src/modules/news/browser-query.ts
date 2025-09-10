import { toInt } from "radash";
import type { SupabaseClient } from "../supabase/client";

export async function getNews(
  client: SupabaseClient,
  options?: BrowserQueryOptions & OptionalPagination & { userId?: string },
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let query = client
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
  if (options?.userId) {
    query = query.eq("user_id", options.userId);
  }
  if (options?.signal) {
    query = query.abortSignal(options.signal);
  }
  if (options?.throwOnError) {
    query = query.throwOnError();
  }

  return await query;
}

export async function getNewsDetail(client: SupabaseClient, slug: string) {
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
    .eq("slug", slug)
    .maybeSingle();

  return res.data;
}

export async function getComments(
  client: SupabaseClient,
  options: Prettify<
    BrowserQueryOptions &
      Partial<{ newsId: string; aspirationId: string } & Pagination>
  >,
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let res = client
    .from("komentar")
    .select(
      `id, isi, tanggal_komentar,
      profiles (id, nama, foto_profil)
      `,
      { count: "exact" },
    )
    .range(from, to);

  if (options.newsId) {
    res = res.eq("berita_id", options.newsId);
  }
  if (options.aspirationId) {
    res = res.eq("aspirasi_id", options.aspirationId);
  }
  if (options?.throwOnError) {
    res = res.throwOnError();
  }
  if (options?.signal) {
    res = res.abortSignal(options.signal);
  }

  return await res;
}

export async function getNewsCategories(
  client: SupabaseClient,
  options?: BrowserQueryOptions & OptionalPagination,
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let query = client
    .from("kategori")
    .select("*", { count: "exact" })
    .eq("jenis", "berita")
    .range(from, to);

  if (options?.signal) {
    query = query.abortSignal(options.signal);
  }
  if (options?.throwOnError) {
    query = query.throwOnError();
  }

  return await query;
}
