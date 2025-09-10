"use client";

import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { useInfiniteAspirations } from "@/modules/aspiration/hooks";
import { A, F, O, pipe } from "@mobily/ts-belt";
import { ChevronsDown } from "lucide-react";

export function AspirationList(props: {
  aspirations: Array<Aspiration>;
  page: number;
  limit: number;
  count: number;
}) {
  let aspirationsQuery = useInfiniteAspirations({
    count: props.count,
    page: props.page,
    limit: props.limit,
    result: props.aspirations,
  });

  let disableButton =
    !aspirationsQuery.hasNextPage ||
    aspirationsQuery.isPending ||
    aspirationsQuery.isFetchingNextPage;

  let aspirations = pipe(
    aspirationsQuery.data.pages,
    O.fromNullable,
    O.mapWithDefault(
      [],
      A.flatMap((d) => d.result),
    ),
    F.toMutable,
  );

  return (
    <section className="pb-8">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4 pb-4">
        {aspirations.map((asp) => (
          <ArticleCard type="aspiration" {...asp} key={asp.id} />
        ))}
      </div>

      {aspirationsQuery.hasNextPage && (
        <Button
          disabled={disableButton}
          onClick={async () => await aspirationsQuery.fetchNextPage()}
        >
          <ChevronsDown /> Muat lebih banyak
        </Button>
      )}
    </section>
  );
}
