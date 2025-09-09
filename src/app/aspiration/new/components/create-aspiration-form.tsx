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
import { withSonnerPromise } from "@/lib/sonner";
import {
  createAspirationSchema,
  type CreateAspirationSchema,
} from "@/modules/aspiration/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";
import { CreateAspirationFormCategory } from "./create-aspiration-form-category";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateAspirationFormUploader } from "./create-aspiration-form-uploader";
import { useCreateAspiration } from "@/modules/aspiration/hooks";

export function CreateAspirationForm() {
  let createAspiration = useCreateAspiration();

  let form = useForm<CreateAspirationSchema>({
    defaultValues: { category: "", description: "", title: "" },
    resolver: zodResolver(createAspirationSchema),
  });

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await createAspiration.mutateAsync(values);
        form.reset();
      },
      {
        loading: "Mengirim aspirasi Anda, harap tunggu..",
        success: "Aspirasi Anda berhasil dikirim",
        error: "Gagal mengirim aspirasi, harap coba lagi nanti",
      },
    ),
  );

  return (
    <Card className="xl:col-span-3">
      <CardHeader>
        <CardTitle>Form Aspirasi Warga</CardTitle>

        <CardDescription>
          Buat aspirasi baru dengan mengisi form aspirasi warga
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={onSubmit} className="grid gap-5">
          <CardContent className="grid gap-5">
            <CreateAspirationFormUploader />
            <CreateAspirationFormCategory />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul Aspirasi</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan judul aspirasi" />
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
                  <FormLabel>Deskripsi Aspirasi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="max-h-64 resize-none"
                      placeholder="Masukkan deskripsi aspirasi"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button disabled={createAspiration.isPending} className="ml-auto">
              Kirim <SendHorizonal />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
