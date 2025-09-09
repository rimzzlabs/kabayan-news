import { createClient } from "./server";
import { uid } from "radash";

export async function uploadFile(options: {
  file: File;
  userId: string;
  bucketName: string;
}) {
  let supabase = await createClient();
  let cleanFileName = options.file.name.replace(/\s+/g, "_");
  let fileName = `${options.userId}/${uid(16)}_${cleanFileName}`;

  let res = await supabase.storage
    .from(options.bucketName)
    .upload(fileName, options.file);

  if (res.error) {
    console.info("upload error: ", res.error);
    return null;
  }

  let urlQuery = supabase.storage
    .from(options.bucketName)
    .getPublicUrl(res.data.path);

  return { publicUrl: urlQuery.data.publicUrl, fullPath: res.data.path };
}

export async function deleteFile(options: {
  bucketName: string;
  fullPath: string;
}) {
  let supabase = await createClient();

  return await supabase.storage
    .from(options.bucketName)
    .remove([options.fullPath]);
}
