"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { withSonnerPromise } from "@/lib/sonner";
import { useCreateComment } from "@/modules/news/hooks";
import {
  type CreateCommentSchema,
  createCommentSchema,
} from "@/modules/news/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, SendHorizonal } from "lucide-react";
import { useForm } from "react-hook-form";

type NewsCommentFormProps = {
  newsId: string;
  newsType: "berita" | "aspirasi";
  userId?: string;
};

export function NewsCommentForm(props: NewsCommentFormProps) {
  let createComment = useCreateComment();

  let form = useForm<CreateCommentSchema>({
    mode: "all",
    defaultValues: {
      comment: "",
      newsId: props.newsId,
      newsType: props.newsType,
      userId: props?.userId ?? "",
    },
    resolver: zodResolver(createCommentSchema),
  });

  let placeholder = props.userId
    ? "Masukan komentar"
    : "Login untuk menambahkan komentar";
  let disableButton = form.formState.isSubmitting || createComment.isPending;

  let onSubmit = form.handleSubmit(
    withSonnerPromise(
      async (values) => {
        await createComment.mutateAsync(values);
        form.reset();
      },
      {
        loading: "Menambahkan komentar",
        success: "Komentar berhasil ditambahkan",
        error: "Gagal menambahkan komentar, harap coba lagi nanti",
      },
    ),
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="pt-2 grid gap-4">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tambahkan Komentar</FormLabel>
              <FormControl>
                <Textarea
                  disabled={!props.userId}
                  placeholder={placeholder}
                  className="h-40 resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {props.userId ? (
          <Button disabled={disableButton} className="max-w-max ml-auto">
            Kirim <SendHorizonal className="size-4" />
          </Button>
        ) : (
          <ButtonLink
            href="/auth/signin"
            className="max-w-max ml-auto"
            variant="secondary"
          >
            Login <ArrowRight />
          </ButtonLink>
        )}
      </form>
    </Form>
  );
}
