import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/date";
import { trimParagraph } from "@/lib/string";
import { pipe } from "@mobily/ts-belt";
import { EyeIcon, MessageCircle } from "lucide-react";

export function RecentAspirationListItem(props: Aspiration) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {props.tanggal_kirim && (
            <p className="text-sm text-muted-foreground">
              <time dateTime={new Date(props.tanggal_kirim).toISOString()}>
                {pipe(props.tanggal_kirim, formatDate("dd MMMM yyyy"))}
              </time>
            </p>
          )}

          {props.kategori && (
            <Badge variant="outline" size="lg" className="ml-auto">
              {props.kategori.nama}
            </Badge>
          )}
        </div>

        <CardTitle>{props.judul}</CardTitle>
        <CardDescription>{trimParagraph(props.deskripsi)}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <div className="inline-flex gap-4">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="size-3.5" />
            <span className="text-xs font-medium">
              {props.komentar.length} Komentar
            </span>
          </div>
        </div>

        <ButtonLink className="ml-auto" href={`/aspiration/${props.slug}`}>
          <EyeIcon />
          Lihat
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
