"use client";

import { useIsClient } from "@/hooks/use-is-client";
import { useInfiniteComments } from "@/modules/comment/hooks";
import { ChevronsDown, Loader } from "lucide-react";
import { ArticleCommentListItem } from "./article-comment-list-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArticleCommentForm } from "./article-comment-form";
import { useUser } from "@/modules/auth/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { A, F, O, pipe } from "@mobily/ts-belt";

type ArticleCommentListProps = {
  newsId: string;
  type: "berita" | "aspirasi";
};

export function ArticleCommentList(props: ArticleCommentListProps) {
  let isClient = useIsClient();
  let userQuery = useUser();
  let commentsQuery = useInfiniteComments(
    props.type === "berita"
      ? {
          type: "berita",
          newsId: props.newsId,
        }
      : { type: "aspirasi", aspirationId: props.newsId },
  );

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

  let disableLoadMoreButton =
    !commentsQuery.hasNextPage ||
    commentsQuery.isPending ||
    commentsQuery.isFetchingNextPage;

  let loadMoreButtonLabel = commentsQuery.hasNextPage
    ? "Muat lebih banyak komentar"
    : "Sudah memuat semua komentar";

  let comments = pipe(
    commentsQuery.data.pages,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    A.flatMap((d) => d.result),
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let onClickLoadMore = async () => {
    console.info("I run");
    await commentsQuery.fetchNextPage();
  };

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
            <ArticleCommentListItem key={comment.id} {...comment} />
          ))}

          <div className="pb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onClickLoadMore}
              disabled={disableLoadMoreButton}
            >
              {commentsQuery.hasNextPage ? <ChevronsDown /> : null}
              {loadMoreButtonLabel}
            </Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-96 mb-3">
          <div className="py-3 pl-1 pr-3 grid gap-3">
            {comments.map((comment) => (
              <ArticleCommentListItem key={comment.id} {...comment} />
            ))}

            <div className="pb-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onClickLoadMore}
                disabled={disableLoadMoreButton}
              >
                {commentsQuery.hasNextPage ? <ChevronsDown /> : null}
                {loadMoreButtonLabel}
              </Button>
            </div>
          </div>
        </ScrollArea>
      )}

      {!userQuery.isSuccess && (
        <div className="h-72 grid place-items-center">
          <Skeleton className="h-60 w-full grid place-items-center">
            <Loader className="animate-spin size-5 stroke-muted-foreground" />
          </Skeleton>
        </div>
      )}

      {userQuery.isSuccess && (
        <ArticleCommentForm
          newsType={props.type}
          newsId={props.newsId}
          userId={userQuery.data?.id}
          key={userQuery.data?.id}
        />
      )}
    </section>
  );
}
