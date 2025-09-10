import { match } from "ts-pattern";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { parseAsInteger, useQueryState } from "nuqs";

interface DataTablePaginationProps {
  pages: number;
}

/**
 * use [page] query param to retrieve the current page
 * @param props
 * @returns
 */
export function DataTablePagination(props: DataTablePaginationProps) {
  let [page, setActivePage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  let paginations = usePagination({
    page,
    pages: props.pages,
  });

  return (
    <Pagination>
      <PaginationContent>
        {paginations.map((pagination) =>
          match(pagination)
            .with({ type: "hidden" }, () => null)
            .with({ type: "elipsis" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationEllipsis size="default" />
              </PaginationItem>
            ))
            .with({ type: "prev" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationPrevious
                  size="default"
                  disabled={page === 1}
                  onClick={() => setActivePage(page - 1)}
                />
              </PaginationItem>
            ))
            .with({ type: "next" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationNext
                  size="default"
                  disabled={page === props.pages}
                  onClick={() => setActivePage(page + 1)}
                />
              </PaginationItem>
            ))
            .with({ type: "page" }, (item) => (
              <PaginationItem key={item.value}>
                <PaginationLink
                  size="default"
                  className={cn("px-3.5 w-auto", item.value < 10 && "px-4")}
                  isActive={page === item.value}
                  onClick={() => setActivePage(item.value)}
                >
                  {item.value}
                </PaginationLink>
              </PaginationItem>
            ))
            .exhaustive(),
        )}
      </PaginationContent>
    </Pagination>
  );
}
