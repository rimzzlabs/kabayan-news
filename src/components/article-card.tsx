import { Badge, type BadgeVariants } from "@/components/ui/badge";
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
import { title } from "radash";
import { match, P } from "ts-pattern";
import { ArticleAspirationCardRemove } from "./article-aspiration-card-remove";

type ArticleCardProps =
  | ({
      type: "news";
    } & News)
  | ({ type: "aspiration" } & Aspiration);

export function ArticleCard(props: ArticleCardProps) {
  let pathnameDetails =
    props.type === "news" ? `/news/${props.slug}` : `/aspiration/${props.slug}`;

  return (
    <Card className="pt-0">
      {props.foto_url ? (
        <Image
          width={256}
          height={480}
          alt={props.judul}
          src={props.foto_url}
          className="w-full aspect-video object-cover rounded-t-lg"
        />
      ) : (
        <div className="bg-muted text-muted-foreground rounded-t-lg aspect-video flex flex-col items-center justify-center">
          <ImageOff className="size-8" />
          <p className="text-center text-sm select-none">Belum ada foto</p>
        </div>
      )}
      <CardHeader>
        {props.type === "aspiration" && (
          <div className="flex items-center gap-2 pb-4">
            {props.status && (
              <Badge
                variant={match<string, BadgeVariants>(props.status)
                  .with("selesai", () => "success")
                  .with(P.union("diverifikasi", "diproses"), () => "warning")
                  .otherwise(() => "outline")}
              >
                {title(props.status)}
              </Badge>
            )}

            <ArticleAspirationCardRemove {...props} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {props.type === "news" && props.tanggal_publikasi && (
            <p className="text-sm text-muted-foreground">
              <time dateTime={new Date(props.tanggal_publikasi).toISOString()}>
                {pipe(props.tanggal_publikasi, formatDate("dd MMMM yyyy"))}
              </time>
            </p>
          )}

          {props.type === "aspiration" && props.tanggal_kirim && (
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
        <CardDescription>
          {trimParagraph(props.type === "news" ? props.isi : props.deskripsi)}
        </CardDescription>
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

        <ButtonLink className="ml-auto" href={pathnameDetails}>
          Selengkapnya
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
