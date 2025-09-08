import type { SupabaseClient } from "../supabase/client";

export async function getUser(client: SupabaseClient) {
  let res = await client.auth.getUser();

  if (!res.data.user?.id) return null;

  let user = await client
    .from("profiles")
    .select("*")
    .eq("id", res.data.user.id)
    .maybeSingle();

  return user.data;
}
