import { Badge, type BadgeVariants } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { trimParagraph } from "@/lib/string";
import { O, pipe } from "@mobily/ts-belt";
import { createColumnHelper } from "@tanstack/react-table";
import { title } from "radash";
import { match, P } from "ts-pattern";
import { AspirationTableColumnAction } from "./aspiration-table-column-action";
import { ImageOffIcon } from "lucide-react";
import Image from "next/image";

let ch = createColumnHelper<Aspiration>();

export const aspirationTableColumn = [
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

  ch.accessor("judul", {
    header: "Judul",
    cell: (f) => f.getValue(),
  }),
  ch.accessor("deskripsi", {
    header: "Deskripsi",
    cell: (f) => {
      return (
        <p className="whitespace-pre-wrap break-words w-72">
          {trimParagraph(f.getValue())}
        </p>
      );
    },
  }),
  ch.accessor("status", {
    header: "Status",
    cell: (f) => {
      let status = f.getValue();
      let variant = match<typeof status, BadgeVariants>(status)
        .with(P.union("diverifikasi", "diproses"), () => "warning")
        .with("ditolak", () => "destructive")
        .with("selesai", () => "success")
        .otherwise(() => "outline");

      return <Badge variant={variant}>{title(status)}</Badge>;
    },
  }),
  ch.accessor("tanggal_kirim", {
    header: "Tanggal dikirim",
    cell: (f) =>
      pipe(
        f.getValue(),
        O.mapWithDefault("-", formatDate("dd MMMM yyyy HH:mm:ss")),
      ),
  }),
  ch.display({
    header: "Aksi",
    id: "action",
    cell: (f) => <AspirationTableColumnAction {...f.row.original} />,
  }),
];
