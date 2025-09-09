"use server";

import { failedAction, successAction } from "@/lib/action";
import { createClient } from "../supabase/server";
import type { CreateCommentSchema } from "./zod-schema";
import { match } from "ts-pattern";
import { revalidatePath } from "next/cache";

export async function createCommentAction(payload: CreateCommentSchema) {
  let client = await createClient();

  let payloadValue = match(payload.newsType)
    .with("berita", () => ({
      berita_id: payload.newsId,
      isi: payload.comment,
      user_id: payload.userId,
    }))
    .with("aspirasi", () => ({
      aspirasi_id: payload.newsId,
      isi: payload.comment,
      user_id: payload.userId,
    }))
    .exhaustive();

  let res = await client.from("komentar").insert(payloadValue);

  if (res.error) {
    console.info(res.error);
    return failedAction("Gagal membuat komentar");
  }
  if (payload.newsType === "aspirasi") {
    revalidatePath("/aspiration/[slug]", "page");
  } else {
    revalidatePath("/news/[slug]", "page");
  }

  return successAction({ newsId: payload.newsId });
}
