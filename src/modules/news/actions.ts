"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "../supabase/server";
import type { CreateNewsSchema, UpdateNewsSchema } from "./zod-schema";
import { revalidatePath } from "next/cache";

export async function createNewsAction(payload: CreateNewsSchema) {
  let supabase = await createClient();
  let user = await supabase.auth.getUser();

  let userId = user.data.user?.id;

  if (!userId) return failedAction("Unauthorized");

  let res = await supabase.from("berita").insert({
    judul: payload.title,
    isi: payload.description,
    slug: payload.title,
    kategori_id: payload.category,
    foto_url: payload.imgUrl,
    user_id: userId,
    status: payload.status,
  });

  if (res.error) {
    console.info("Failed news creation ", res.error);
    return failedAction("Gagal membuat berita");
  }

  return successAction({ message: "Berhasil membuat berita" });
}

export async function updateNewsAction(payload: UpdateNewsSchema) {
  let supabase = await createClient();
  let user = await supabase.auth.getUser();

  let userId = user.data.user?.id;

  if (!userId) return failedAction("Unauthorized");

  let res = await supabase
    .from("berita")
    .update({
      judul: payload.title,
      isi: payload.description,
      kategori_id: payload.category,
      foto_url: payload.imgUrl,
      status: payload.status,
    })
    .eq("id", payload.id);

  if (res.error) {
    console.info("Failed news update ", res.error);
    return failedAction("Gagal memperbarui berita");
  }

  revalidatePath("/", "layout");

  return successAction({ message: "Berhasil memperbarui berita" });
}

export async function removeNewsAction(id: string) {
  let supabase = await createClient();
  let commentQuery = await supabase
    .from("komentar")
    .delete()
    .eq("berita_id", id);

  if (commentQuery.error) {
    console.info("Failed comment deletion ", commentQuery.error);
    return failedAction("Gagal menghapus komentar");
  }

  let res = await supabase.from("berita").delete().eq("id", id);

  if (res.error) {
    console.info("Failed news deletion ", res.error);
    return failedAction("Gagal menghapus berita");
  }

  return successAction({ id });
}
