import { toInt } from "radash";
import type { SupabaseServerClient } from "../supabase/server";

export async function getServerCategories(
  client: SupabaseServerClient,
  options: Omit<QueryOptions, "userId"> & { type?: "berita" | "aspirasi" },
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

  return await query;
}
