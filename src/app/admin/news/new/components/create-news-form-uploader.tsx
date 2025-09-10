// app/components/image-uploader/ImageUploader.tsx
"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ImagePlus, Trash2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { uploadImage, deleteImage } from "@/modules/supabase/action";
import { withSonnerPromise } from "@/lib/sonner";
import { cn } from "@/lib/utils";
import type { UpdateNewsSchema } from "@/modules/news/zod-schema";

export function CreateNewsFormUploader() {
  let form = useFormContext<UpdateNewsSchema>();

  let [isBusy, setIsBusy] = useState(false);
  let [filePath, setFilePath] = useState<string | null>(null);
  let [imageUrl, setImageUrl] = useState<string | null>(null);

  let selectedImageUrl = useWatch({ control: form.control, name: "imgUrl" });

  let onDrop = withSonnerPromise(
    async (acceptedFiles: Array<File>) => {
      let file = acceptedFiles[0];
      if (filePath) {
        await deleteImage({ fullPath: filePath, bucketName: "foto-aspirasi" });
      }

      if (file) {
        setIsBusy(true);
        let fd = new FormData();
        fd.set("file", file);

        let res = await uploadImage(fd, "foto-berita");

        setIsBusy(false);
        if (res.error) throw new Error("Failed to upload image");
        form.setValue("imgUrl", res.result.publicUrl);
        setFilePath(res.result.filePath);
        setImageUrl(res.result.publicUrl);
      }
    },
    {
      loading: "Mengupload foto...",
      success: "Berhasil mengupload foto",
      error: "Gagal mengupload foto",
    },
  );

  let dropZone = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  let onDelete = withSonnerPromise(
    async () => {
      if (!filePath) return;
      setIsBusy(true);
      await deleteImage({ fullPath: filePath, bucketName: "foto-aspirasi" });
      setIsBusy(false);
      setFilePath(null);
      setImageUrl(null);
    },
    {
      loading: "Memuat...",
      success: "Berhasil menghapus gambar",
      error: "Gagal menghapus gambar",
    },
  );

  let onReplace = () => dropZone.open();

  // biome-ignore lint/correctness/useExhaustiveDependencies: watch only when selectedImageUrl changes
  useEffect(() => {
    if (!selectedImageUrl && imageUrl) {
      setImageUrl(null);
    }
  }, [selectedImageUrl]);

  return (
    <Card className="p-0 w-full lg:w-[28rem] shadow-none bg-muted">
      <CardContent className="p-5">
        <div
          {...dropZone.getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            !isBusy && "cursor-pointer",
            imageUrl && "hidden",
            dropZone.isDragActive && "border-primary bg-primary/5",
            !dropZone.isDragActive &&
              "border-muted-foreground hover:border-primary/50",
          )}
        >
          <input {...dropZone.getInputProps()} disabled={isBusy} />
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {dropZone.isDragActive
                  ? "Lepaskan untuk mengunggah"
                  : "Seret & lepas foto di sini, atau klik untuk memilih"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, JPEG, PNG, atau WEBP (maks. 5MB)
              </p>
            </div>
          </div>
        </div>

        {imageUrl && (
          <div className="space-y-4">
            <div className="relative">
              {isBusy && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-background/5">
                  <Loader2 className="size-5 animate-spin stroke-primary" />
                </div>
              )}
              <Image
                alt="Preview"
                src={imageUrl}
                width={448}
                height={256}
                className="w-full h-64 rounded-lg aspect-video object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  disabled={isBusy}
                  onClick={onReplace}
                  className="bg-background/80 hover:bg-background"
                  title="Ganti foto"
                >
                  <RefreshCw
                    className={`size-4 ${isBusy ? "animate-spin" : ""}`}
                  />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  disabled={isBusy}
                  onClick={onDelete}
                  title="Hapus foto"
                  variant="destructive"
                  className="bg-background/80 hover:bg-background"
                >
                  <Trash2 className="size-4 stroke-destructive" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                onClick={onReplace}
                className="w-full"
              >
                Ganti Foto
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isBusy}
                onClick={onDelete}
                className="w-full"
              >
                Hapus Foto
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2 text-balance">
              Klik "Ganti Foto" untuk mengganti atau "Hapus Foto" untuk
              membatalkan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
