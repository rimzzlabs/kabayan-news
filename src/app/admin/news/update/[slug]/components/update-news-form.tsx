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
import { useNewsCategories, useUpdateNews } from "@/modules/news/hooks";
import type { getServerNewsDetail } from "@/modules/news/query";
import {
  updateNewsSchema,
  type UpdateNewsSchema,
} from "@/modules/news/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { F, O, pipe } from "@mobily/ts-belt";
import { Download, Loader } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { UpdateNewsFormUploader } from "./update-news-form-uploader";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type UpdateNewsProps = NonNullable<
  Awaited<ReturnType<typeof getServerNewsDetail>>
>;
export function UpdateNewsForm(props: UpdateNewsProps) {
  const status = props.status === "draft" ? "draft" : "published";

  let updateNews = useUpdateNews();
  let router = useRouter();
  let categoriesQuery = useNewsCategories({ limit: 500 });
  let [isPending, startTransition] = useTransition();

  let form = useForm<UpdateNewsSchema>({
    defaultValues: {
      status,
      id: props.id,
      title: props.judul,
      description: props.isi ?? "",
      imgUrl: props.foto_url ?? "",
      category: props.kategori?.id ?? "",
    },
    resolver: zodResolver(updateNewsSchema),
  });

  let title = useWatch({ control: form.control, name: "title" });
  let description = useWatch({ control: form.control, name: "description" });
  let category = useWatch({ control: form.control, name: "category" });
  let imgUrl = useWatch({ control: form.control, name: "imgUrl" });
  let selectedStatus = useWatch({ control: form.control, name: "status" });

  let categories = pipe(
    categoriesQuery.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let sameTitle = title === props.judul;
  let sameDescription = description === (props.isi ?? "");
  let sameCategory = category === (props.kategori?.id ?? "");
  let sameImgUrl = imgUrl === (props.foto_url ?? "");
  let sameStatus = selectedStatus === status;

  let isUpdating =
    form.formState.isSubmitting || updateNews.isPending || isPending;
  let disableButton =
    (sameTitle &&
      sameDescription &&
      sameCategory &&
      sameImgUrl &&
      sameStatus) ||
    isUpdating;

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await updateNews.mutateAsync(values);
        startTransition(() => {
          router.push("/admin/news");
        });
      },
      {
        loading: "Memperbarui berita, harap tunggu...",
        success: "Berita berhasil diperbarui",
        error: "Gagal memperbarui berita, harap coba lagi nanti",
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
            <UpdateNewsFormUploader foto_url={props.foto_url} />

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
            <Button disabled={disableButton} className="ml-auto">
              Simpan{" "}
              {isUpdating ? <Loader className="animate-spin" /> : <Download />}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
