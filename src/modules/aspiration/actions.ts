"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "../supabase/server";
import type { CreateAspirationSchema } from "./zod-schema";
import { revalidatePath } from "next/cache";

export async function createAspirationAction(payload: CreateAspirationSchema) {
  let supabase = await createClient();

  let session = await supabase.auth.getSession();

  if (!session.data.session?.user.id) return failedAction("Unauthorized");

  let res = await supabase.from("aspirasi").insert({
    judul: payload.title,
    deskripsi: payload.description,
    slug: payload.title,
    kategori_id: payload.category,
    foto_url: payload.imgUrl,
    user_id: session.data.session?.user.id,
  });

  if (res.error) {
    console.info("Failed aspiration creation ", res.error);
    return failedAction("Gagal membuat aspirasi");
  }

  revalidatePath("/aspiration");

  return successAction({ message: "Berhasil membuat aspirasi" });
}

export async function removeAspirationAction(payloada: {
  aspirationId: string;
}) {
  let supabase = await createClient();

  // remove comment first
  await supabase
    .from("komentar")
    .delete()
    .eq("aspirasi_id", payloada.aspirationId);

  let res = await supabase
    .from("aspirasi")
    .delete()
    .eq("id", payloada.aspirationId);

  if (res.error) {
    console.info("Failed aspiration deletion ", res.error);
    return failedAction("Gagal menghapus aspirasi");
  }

  revalidatePath("/aspiration");

  return successAction({ message: "Berhasil menghapus aspirasi" });
}
