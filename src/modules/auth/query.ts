import { createClient } from "../supabase/server";

export async function getServerUser() {
  let supabase = await createClient();
  let user = await supabase.auth.getUser();

  if (!user.data.user) return null;
  return user.data.user;
}

export async function getServerSession() {
  let supabase = await createClient();

  let session = await supabase.auth.getSession();
  if (session.error) return null;

  return session.data.session;
}

export async function getServerProfile() {
  let supabase = await createClient();
  let session = await getServerSession();

  if (!session) return null;

  let userQuery = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (userQuery.error) return null;

  return userQuery.data;
}
