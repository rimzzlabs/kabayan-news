"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "../supabase/server";
import type { CreateCategorySchema, UpdateCategorySchema } from "./zod-schema";

export async function createCategoryAction(payload: CreateCategorySchema) {
  let client = await createClient();

  let res = await client.from("kategori").insert({
    nama: payload.name,
    deskripsi: payload.description,
    jenis: payload.type,
  });

  if (res.error) {
    console.info("Failed category creation ", res.error);
    return failedAction("Gagal membuat kategori");
  }

  return successAction({ message: "Berhasil membuat kategori" });
}

export async function updateCategoryAction(
  payload: { id: string } & Partial<Omit<UpdateCategorySchema, "id">>,
) {
  let client = await createClient();

  let res = await client
    .from("kategori")
    .update({
      nama: payload.name,
      deskripsi: payload.description,
    })
    .eq("id", payload.id);

  if (res.error) {
    console.info("Failed category update ", res.error);
    return failedAction("Gagal memperbarui kategori");
  }

  return successAction({ message: "Berhasil memperbarui kategori" });
}

export async function removeCategoryAction(id: string) {
  let client = await createClient();

  let res = await client.from("kategori").delete().eq("id", id);
  if (res.error) {
    console.info("Failed category deletion ", res.error);
    return failedAction("Gagal menghapus kategori");
  }

  return successAction({ message: "Berhasil menghapus kategori" });
}
