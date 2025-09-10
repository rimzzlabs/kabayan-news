import { formatDate } from "@/lib/date";
import { O, pipe, S } from "@mobily/ts-belt";
import { createColumnHelper } from "@tanstack/react-table";
import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import { NewsTableColumnAction } from "./news-table-column-action";
import { trimParagraph } from "@/lib/string";
import { NewsTableColumnStatus } from "./news-table-column-status";

let ch = createColumnHelper<News>();

export const newsTableColumn = [
  ch.accessor("foto_url", {
    header: "Foto",
    cell: (f) => {
      let photoUrl = f.getValue();

      if (!photoUrl) {
        return (
          <div className="flex flex-col items-center justify-center text-center gap-1 text-muted-foreground w-32 h-20 bg-muted rounded-md">
            <ImageOffIcon className="size-5" />
            <p className="text-xs font-medium">Tidak ada foto</p>
          </div>
        );
      }

      return (
        <Image
          src={photoUrl}
          alt={f.row.original.judul}
          width={128}
          height={40}
          className="w-32 h-20 rounded-md object-cover"
        />
      );
    },
  }),
  ch.accessor("judul", { header: "Judul" }),
  ch.accessor("isi", {
    header: "Isi Berita",
    cell: (f) => {
      return (
        <p className="whitespace-pre-wrap break-words w-72">
          {trimParagraph(f.getValue())}
        </p>
      );
    },
  }),
  ch.accessor("kategori.nama", {
    header: "Kategori",
    cell: (f) => f.getValue() ?? "-",
  }),
  ch.accessor("komentar", {
    header: "Jumlah komentar",
    cell: (f) => pipe(f.getValue().length, String, S.append(" Komentator")),
  }),
  ch.accessor("tanggal_dibuat", {
    header: "Tanggal dibuat",
    cell: (f) => pipe(f.getValue(), formatDate("dd MMMM yyyy HH:mm:ss")),
  }),
  ch.accessor("tanggal_publikasi", {
    header: "Tanggal publikasi",
    cell: (f) =>
      pipe(
        f.getValue(),
        O.fromNullable,
        O.mapWithDefault("-", formatDate("dd MMMM yyyy HH:mm:ss")),
      ),
  }),
  ch.accessor("status", {
    header: "Status",
    cell: (f) => <NewsTableColumnStatus {...f.row.original} />,
  }),
  ch.display({
    header: "Aksi",
    id: "action",
    cell: (f) => <NewsTableColumnAction {...f.row.original} />,
  }),
];
