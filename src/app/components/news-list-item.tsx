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
import { ImageOff, MessageCircle } from "lucide-react";
import Image from "next/image";

export function NewsListItem(props: News) {
  return (
    <Card className="pt-0">
      {props.foto_url ? (
        <Image
          width={256}
          height={480}
          alt={props.judul}
          src={props.foto_url}
          className="w-full aspect-video object-cover"
        />
      ) : (
        <div className="bg-muted text-muted-foreground aspect-video flex flex-col items-center justify-center">
          <ImageOff className="size-8" />
          <p className="text-center text-sm select-none">Belum ada foto</p>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2">
          {props.tanggal_publikasi && (
            <p className="text-sm text-muted-foreground">
              <time dateTime={new Date(props.tanggal_publikasi).toISOString()}>
                {pipe(props.tanggal_publikasi, formatDate("dd MMMM yyyy"))}
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
        <CardDescription>{trimParagraph(props.isi)}</CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <MessageCircle className="size-3.5" />
          <span className="text-xs font-medium">
            {props.komentar.length} Komentar
          </span>
        </div>

        <ButtonLink className="ml-auto" href={`/news/${props.slug}`}>
          Selengkapnya
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
