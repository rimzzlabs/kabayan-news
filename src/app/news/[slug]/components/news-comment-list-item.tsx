import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "@/lib/date";
import { pipe } from "@mobily/ts-belt";
import { Calendar1Icon, User2Icon } from "lucide-react";

export function NewsCommentListItem(props: NewsComment) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.isi}</CardTitle>

        <div className="inline-flex items-center gap-4 pt-2">
          {props.tanggal_komentar && (
            <div className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm">
              <Calendar1Icon className="size-4 shrink-0" />
              <time dateTime={new Date(props.tanggal_komentar).toISOString()}>
                {pipe(props.tanggal_komentar, formatDistance)}
              </time>
            </div>
          )}

          <div className="h-4 w-px bg-muted-foreground" />

          <div className="inline-flex items-center gap-2 text-muted-foreground font-medium text-sm">
            <User2Icon className="size-4 shrink-0" />
            <span>{props.profiles?.nama}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
