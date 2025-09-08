"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { useComments } from "@/modules/news/hooks";
import { ChevronsDown, Loader } from "lucide-react";
import { NewsCommentListItem } from "./news-comment-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { NewsCommentForm } from "./news-comment-form";
import { useUser } from "@/modules/auth/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsCommentList(props: { newsId: string }) {
  let isClient = useIsClient();
  let commentsQuery = useComments({ newsId: props.newsId });
  let userQuery = useUser();

  if (!isClient || !commentsQuery.isSuccess) {
    return (
      <section>
        <h2 className="text-xl lg:text-2xl font-semibold pb-3">
          Komentar warga
        </h2>

        <div className="h-96 grid place-items-center">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader className="animate-spin size-5 stroke-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Memuat komentar
            </span>
          </div>
        </div>
      </section>
    );
  }

  let comments = commentsQuery.data;

  return (
    <section className="pt-4 border-t pb-10">
      <h2 className="text-xl lg:text-2xl font-semibold pb-3">Komentar warga</h2>

      {comments.length === 0 && (
        <div className="h-96 grid place-items-center">
          <div className="flex flex-col w-full">
            <p className="text-sm font-medium text-muted-foreground text-center">
              Belum ada komentar warga, jadilah yang pertama!
            </p>
          </div>
        </div>
      )}

      {comments.length <= 2 ? (
        <div className="py-3 pl-1 pr-3 grid gap-3">
          {comments.map((comment) => (
            <NewsCommentListItem key={comment.id} {...comment} />
          ))}

          <div className="pb-2">
            <Button size="sm" variant="outline">
              <ChevronsDown />
              Muat komentar
            </Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-96 mb-3">
          <div className="py-3 pl-1 pr-3 grid gap-3">
            {comments.map((comment) => (
              <NewsCommentListItem key={comment.id} {...comment} />
            ))}

            <div className="pb-2">
              <Button size="sm" variant="outline">
                <ChevronsDown />
                Muat komentar
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}

      {!userQuery.isSuccess ? (
        <div className="h-72 grid place-items-center">
          <Skeleton className="h-60 w-full grid place-items-center">
            <Loader className="animate-spin size-5 stroke-muted-foreground" />
          </Skeleton>
        </div>
      ) : (
        <NewsCommentForm
          newsType="berita"
          newsId={props.newsId}
          userId={userQuery.data?.id}
          key={userQuery.data?.id}
        />
      )}
    </section>
  );
}
