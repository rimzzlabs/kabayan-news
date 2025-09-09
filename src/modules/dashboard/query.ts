import type { SupabaseServerClient } from "../supabase/server";

export async function getServerCounters(
  client: SupabaseServerClient,
): Promise<DashboardCardsCounterProps> {
  let newsQuery = client.from("berita").select("id", { count: "exact" });
  let aspirationsQuery = client
    .from("aspirasi")
    .select("id", { count: "exact" })
    .eq("status", "dikirim");
  let processedAspirationsQuery = client
    .from("aspirasi")
    .select("id", { count: "exact" })
    .in("status", ["diverifikasi", "diproses"]);
  let completedAspirationsQuery = client
    .from("aspirasi")
    .select("id", { count: "exact" })
    .eq("status", "selesai");

  let [news, aspirations, processedAspirations, completedAspirations] =
    await Promise.all([
      newsQuery,
      aspirationsQuery,
      processedAspirationsQuery,
      completedAspirationsQuery,
    ]);

  return {
    news: news.count ?? 0,
    aspiration: aspirations.count ?? 0,
    aspirationCompleted: completedAspirations.count ?? 0,
    aspirationProcessed: processedAspirations.count ?? 0,
  };
}
