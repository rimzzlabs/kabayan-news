import { toInt } from "radash";
import type { SupabaseClient } from "../supabase/client";

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
