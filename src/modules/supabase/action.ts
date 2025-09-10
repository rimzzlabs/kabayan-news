"use server";

import { failedAction, successAction } from "@/lib/action";
import { getServerUser } from "../auth/query";
import { deleteFile, uploadFile } from "./utils";

export async function uploadImage(fd: FormData, bucketName: string) {
  let file = fd.get("file") as File | null;
  if (!file) return failedAction("File not found");

  let user = await getServerUser();
  if (!user) return failedAction("Session not found");

  let userId = user.id;
  let res = await uploadFile({ file, userId, bucketName });

  if (!res) return failedAction("Upload failed");

  return successAction({ publicUrl: res.publicUrl, filePath: res.fullPath });
}

export async function deleteImage(options: {
  fullPath: string;
  bucketName: string;
}) {
  return await deleteFile(options);
}
