"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { preventDefault } from "@/lib/event";
import { withSonnerPromise } from "@/lib/sonner";
import { useRemoveCategory, useUpdateCategory } from "@/modules/category/hooks";
import {
  type UpdateCategorySchema,
  updateCategorySchema,
} from "@/modules/category/zod-schema";
import type { Tables } from "@/modules/supabase/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVerticalIcon, PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CategoryTableColumnAction(props: Tables<"kategori">) {
  let removeCategory = useRemoveCategory();
  let updateCategory = useUpdateCategory();

  let [updateOpen, setUpdateOpen] = useState(false);

  let form = useForm<UpdateCategorySchema>({
    defaultValues: {
      id: props.id,
      description: props.deskripsi ?? "",
      name: props.nama ?? "",
      type: props.jenis === "berita" ? "berita" : "aspirasi",
    },
    resolver: zodResolver(updateCategorySchema),
  });

  let onRemove = withSonnerPromise(
    async () => await removeCategory.mutateAsync(props.id),
    {
      loading: "Menghapus kategori...",
      success: "Kategori berhasil dihapus",
      error: "Gagal menghapus kategori, harap coba lagi nanti",
    },
  );

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        setUpdateOpen(false);
        await updateCategory.mutateAsync(values);
        form.reset();
      },
      {
        loading: "Mengubah kategori...",
        success: "Kategori berhasil diubah",
        error: "Gagal mengubah kategori, harap coba lagi nanti",
      },
    ),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={removeCategory.isPending} asChild>
        <Button variant="outline">
          <span className="sr-only">Menu</span>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <AlertDialog open={updateOpen} onOpenChange={setUpdateOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={preventDefault}
              disabled={updateCategory.isPending || removeCategory.isPending}
            >
              <PenIcon /> Edit
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Perbarui kategori</AlertDialogTitle>
              <AlertDialogDescription>
                Perbarui kategori {props.nama}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Form {...form}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe kategori</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger ref={field.ref}>
                              <SelectValue placeholder="Pilih tipe kategori" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value="berita">Berita</SelectItem>
                            <SelectItem value="aspirasi">Aspirasi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama kategori</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nama kategori" />
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
                        <FormLabel>Deskripsi kategori</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Deskripsi kategori"
                            className="max-h-36 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <AlertDialogFooter className="pt-5">
                  <AlertDialogCancel type="button">Batal</AlertDialogCancel>

                  <Button>Perbarui Kategori</Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={preventDefault}
              disabled={updateCategory.isPending || removeCategory.isPending}
            >
              <TrashIcon /> Hapus
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kategori ini?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>

              <Button variant="destructive" asChild>
                <AlertDialogAction onClick={onRemove}>
                  Ya, hapus kategori
                </AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
