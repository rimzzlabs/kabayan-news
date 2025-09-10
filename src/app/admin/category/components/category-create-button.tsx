"use client";

import {
  AlertDialog,
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
import { withSonnerPromise } from "@/lib/sonner";
import { useCreateCategory } from "@/modules/category/hooks";
import {
  type CreateCategorySchema,
  createCategorySchema,
} from "@/modules/category/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function CategoryCreateButton() {
  let [open, setOpen] = useState(false);
  let createCategory = useCreateCategory();

  let form = useForm<CreateCategorySchema>({
    defaultValues: { name: "", description: "", type: "berita" },
    resolver: zodResolver(createCategorySchema),
  });

  let disableButton = createCategory.isPending;

  let onOpenChange = (open: boolean) => {
    setOpen(open);
    form.reset();
  };

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await createCategory.mutateAsync(values);
        onOpenChange(false);
      },
      {
        loading: "Membuat kategori...",
        success: "Kategori berhasil ditambahkan",
        error: "Gagal membuat kategori, harap coba lagi nanti",
      },
    ),
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button className="ml-auto">
          <PlusIcon />
          Buat kategori
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Buat kategori baru</AlertDialogTitle>
          <AlertDialogDescription>
            Kategori baru akan ditambahkan ke daftar kategori
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
              <AlertDialogCancel disabled={disableButton} type="button">
                Batal
              </AlertDialogCancel>
              <Button disabled={disableButton}>Simpan</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
