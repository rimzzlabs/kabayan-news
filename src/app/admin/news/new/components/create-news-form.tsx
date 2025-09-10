"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { withSonnerPromise } from "@/lib/sonner";
import { useCreateNews, useNewsCategories } from "@/modules/news/hooks";
import {
  createNewsSchema,
  type CreateNewsSchema,
} from "@/modules/news/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { F, O, pipe } from "@mobily/ts-belt";
import { Download, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateNewsFormUploader } from "./create-news-form-uploader";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function CreateNewsForm() {
  let createNews = useCreateNews();
  let router = useRouter();
  let categoriesQuery = useNewsCategories({ limit: 500 });
  let [isPending, startTransition] = useTransition();

  let form = useForm<CreateNewsSchema>({
    defaultValues: {
      title: "",
      description: "",
      imgUrl: "",
      category: "",
      status: "draft",
    },
    resolver: zodResolver(createNewsSchema),
  });

  let categories = pipe(
    categoriesQuery.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let isUpdating =
    form.formState.isSubmitting || createNews.isPending || isPending;

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await createNews.mutateAsync(values);
        startTransition(() => {
          router.push("/admin/news");
        });
      },
      {
        loading: "Menambahkan berita baru, harap tunggu...",
        success: "Berhasil menambahkan berita baru",
        error: "Gagal menambahkan berita baru, harap coba lagi nanti",
      },
    ),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perbarui Berita</CardTitle>
        <CardDescription>
          Perbarui berita yang sudah ada di website
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent className="grid gap-5">
            <CreateNewsFormUploader />

            <div className="flex flex-col gap-5 lg:flex-row-reverse lg:justify-end">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publikasi berita</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value === "published"}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? "published" : "draft");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="lg:flex-1 max-w-lg">
                    <FormLabel>Kategori berita</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={categoriesQuery.status !== "success"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full" ref={field.ref}>
                          <SelectValue placeholder="Pilih kategori berita" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul berita</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Judul berita" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi berita</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="max-h-40 resize-none"
                      placeholder="Deskripsi/Isi berita"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="pt-5">
            <Button disabled={isUpdating} className="ml-auto">
              Simpan{" "}
              {isUpdating ? <Loader className="animate-spin" /> : <Download />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
