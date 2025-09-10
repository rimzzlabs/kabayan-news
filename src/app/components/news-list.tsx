"use client";

import { useInfiniteNews } from "@/modules/news/hooks";
import { A, F, O, pipe } from "@mobily/ts-belt";
import { Button } from "@/components/ui/button";
import { ChevronsDown } from "lucide-react";
import { ArticleCard } from "@/components/article-card";

export function NewsList(props: {
  news: Array<News>;
  count: number;
  page: number;
  limit: number;
}) {
  let newsQuery = useInfiniteNews({
    result: props.news,
    count: props.count,
    limit: props.limit,
    page: props.page,
  });

  let disableButton =
    !newsQuery.hasNextPage ||
    newsQuery.isPending ||
    newsQuery.isFetchingNextPage;

  let news = pipe(
    newsQuery.data.pages,
    O.fromNullable,
    O.mapWithDefault(
      [],
      A.flatMap((d) => d.result),
    ),
    F.toMutable,
  );

  return (
    <div className="pb-8">
      <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4 pb-4">
        {news.map((news) => (
          <ArticleCard type="news" {...news} key={news.id} />
        ))}
      </section>

      {newsQuery.hasNextPage && (
        <Button
          disabled={disableButton}
          onClick={async () => await newsQuery.fetchNextPage()}
        >
          <ChevronsDown /> Muat lebih banyak
        </Button>
      )}
    </div>
  );
}
