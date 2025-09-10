import { toInt } from "radash";
import type { SupabaseClient } from "../supabase/client";

export async function getCategories(
  client: SupabaseClient,
  options: BrowserQueryOptions &
    OptionalPagination & { type?: "berita" | "aspirasi" },
) {
  let page = toInt(options?.page, 1);
  let limit = toInt(options?.limit, 10);

  let from = (page - 1) * limit;
  let to = from + limit - 1;

  let query = client
    .from("kategori")
    .select("*", { count: "exact" })
    .range(from, to);

  if (options.type) {
    query = query.eq("jenis", options.type);
  }
  if (options.signal) {
    query = query.abortSignal(options.signal);
  }
  if (options.throwOnError) {
    query = query.throwOnError();
  }

  return await query;
}
