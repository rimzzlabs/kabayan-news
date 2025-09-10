import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/modules/supabase/types";
import { createColumnHelper } from "@tanstack/react-table";
import { title } from "radash";
import { CategoryTableColumnAction } from "./category-table-column-action";

let ch = createColumnHelper<Tables<"kategori">>();

export const categoryTableColumn = [
  ch.accessor("nama", { header: "Kategori" }),
  ch.accessor("deskripsi", { header: "Deskripsi" }),
  ch.accessor("jenis", {
    header: "Jenis kategori",
    cell: (f) => {
      let type = f.getValue();

      return (
        <Badge variant={type === "berita" ? "secondary" : "outline"}>
          {title(type)}
        </Badge>
      );
    },
  }),

  ch.display({
    header: "Aksi",
    id: "action",
    cell: (f) => <CategoryTableColumnAction {...f.row.original} />,
  }),
];
