import { Title } from "@/components/title";
import { formatDate } from "@/lib/date";
import { createClient } from "@/modules/supabase/server";
import { createClient as createBrowserClient } from "@/modules/supabase/client";
import { A, F, O, pipe, S } from "@mobily/ts-belt";
import { ArrowLeft, Calendar1Icon, MessageCircleIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { getAspirations } from "@/modules/aspiration/browser-query";
import { getServerAspirationDetail } from "@/modules/aspiration/query";
import { ArticleCommentList } from "@/components/article-comment-list";
import { ArticleDetailImage } from "@/components/article-detail-image";

export async function generateStaticParams() {
  let client = createBrowserClient();
  let aspirations = await getAspirations(client, { limit: 100 });

  return pipe(
    aspirations.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    A.map((n) => ({ slug: n.slug })),
    F.toMutable,
  );
}

export default async function NewsPage(props: TPageProps) {
  let params = await props.params;
  let client = await createClient();
  let slug = params.slug;
  if (!slug) redirect("/aspiration");

  let aspiration = await getServerAspirationDetail(client, slug);
  if (!aspiration) notFound();

  return (
    <div className="max-w-prose mx-auto">
      <article className="pt-8 pb-10">
        <ButtonLink href="/aspiration" variant="outline">
          <ArrowLeft />
          Kembali
        </ButtonLink>

        <section className="pt-3">
          <ArticleDetailImage
            src={aspiration.foto_url}
            alt={aspiration.judul}
          />

          <div className="flex items-center gap-5 pt-2.5">
            {aspiration.tanggal_kirim && (
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Calendar1Icon className="size-4" />
                <p className="text-sm font-medium">
                  {pipe(
                    aspiration.tanggal_kirim,
                    formatDate("dd MMMM yyyy HH:mm"),
                  )}
                </p>
              </div>
            )}

            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="size-4" />
              <p className="text-sm font-medium">
                {pipe(aspiration.commentsCount, String, S.append(" Komentar"))}
              </p>
            </div>
          </div>
        </section>

        <section className="pt-5 prose prose-neutral dark:prose-invert">
          <Title>{aspiration.judul}</Title>
          <p>{aspiration.deskripsi}</p>
        </section>
      </article>

      <ArticleCommentList type="aspirasi" newsId={aspiration.id} />
    </div>
  );
}
