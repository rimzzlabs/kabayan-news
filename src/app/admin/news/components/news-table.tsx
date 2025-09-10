"use client";

import { useTable } from "@/hooks/use-table";
import { newsTableColumn } from "./news-table-column";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { PlaceholderTableEmpty } from "@/components/placeholder-table-empty";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNews } from "@/modules/news/hooks";
import { parseAsInteger, useQueryState } from "nuqs";
import { F, O, pipe } from "@mobily/ts-belt";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Fragment } from "react";

let limit = 10;

export function NewsTable(props: { news: Array<News>; count: number }) {
  let [page] = useQueryState("page", parseAsInteger.withDefault(1));
  let newsQuery = useNews({
    page,
    limit,
    initialData: { result: props.news, count: props.count },
  });

  let data = pipe(
    newsQuery.data?.result,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  let totalPages = Math.ceil(props.count / limit);

  let table = useTable({ data, columns: newsTableColumn });
  let isEmpty = props.news.length === 0;

  return (
    <Fragment>
      <ScrollArea className="h-[calc(100vh-16rem)] w-full">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="py-4" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isEmpty && (
              <PlaceholderTableEmpty
                colSpan={newsTableColumn.length}
                title="Berita tidak ditemukan"
                description="Tidak ada berita yang dapat ditampilkan"
              />
            )}

            {!isEmpty &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="pt-3">
        <DataTablePagination pages={totalPages} />
      </div>
    </Fragment>
  );
}
