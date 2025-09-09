import { toInt } from "radash";
import type { SupabaseClient } from "../supabase/client";

export async function getAspirations(
  client: SupabaseClient,
  options?: Prettify<
    OptionalPagination & BrowserQueryOptions & { userId?: string }
  >,
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
         user: profiles (id, nama, foto_profil)
         )
        `,
      {
        count: "exact",
      },
    )
    .order("tanggal_kirim", { ascending: false })
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

export async function getAspirationCategories(
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
    .eq("jenis", "aspirasi")
    .range(from, to);

  if (options?.signal) {
    query = query.abortSignal(options.signal);
  }
  if (options?.throwOnError) {
    query = query.throwOnError();
  }

  return await query;
}
