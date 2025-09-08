import { Title } from "@/components/title";
import { formatDate } from "@/lib/date";
import { getServerNewsDetail } from "@/modules/news/query";
import { createClient } from "@/modules/supabase/server";
import { createClient as createBrowserClient } from "@/modules/supabase/client";
import { A, F, pipe, S } from "@mobily/ts-belt";
import {
  ArrowLeft,
  Calendar1Icon,
  ImageOff,
  MessageCircleIcon,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getNews } from "@/modules/news/browser-query";
import { NewsCommentList } from "./components/news-comment-list";
import { ButtonLink } from "@/components/ui/button";

export async function generateStaticParams() {
  let client = createBrowserClient();
  let news = await getNews(client, { limit: 100 });
  return pipe(
    news,
    A.map((n) => ({ slug: n.slug })),
    F.toMutable,
  );
}

export default async function NewsPage(props: TPageProps) {
  let params = await props.params;
  let client = await createClient();
  let slug = params.slug;
  if (!slug) redirect("/");

  let news = await getServerNewsDetail(client, slug);
  if (!news) notFound();

  return (
    <div className="max-w-prose mx-auto">
      <article className="pt-8 pb-10">
        <ButtonLink href="/" variant="secondary">
          <ArrowLeft />
          Kembali
        </ButtonLink>

        <section className="pt-3">
          <div className="bg-muted rounded-md text-muted-foreground w-full aspect-video flex flex-col items-center justify-center">
            <ImageOff className="size-10" />
            <p className="text-muted-foreground font-medium text-sm">
              Belum ada foto
            </p>
          </div>

          <div className="flex items-center gap-5 pt-2.5">
            {news.tanggal_publikasi && (
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Calendar1Icon className="size-4" />
                <p className="text-sm font-medium">
                  {pipe(
                    news.tanggal_publikasi,
                    formatDate("dd MMMM yyyy HH:mm"),
                  )}
                </p>
              </div>
            )}

            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="size-4" />
              <p className="text-sm font-medium">
                {pipe(news.commentsCount, String, S.append(" Komentar"))}
              </p>
            </div>
          </div>
        </section>

        <section className="pt-5 prose prose-neutral dark:prose-invert">
          <Title>{news.judul}</Title>
          <p>{news.isi}</p>
        </section>
      </article>

      <NewsCommentList newsId={news.id} />
    </div>
  );
}
