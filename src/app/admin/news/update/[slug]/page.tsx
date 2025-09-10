import { Title } from "@/components/title";
import { getServerNewsDetail } from "@/modules/news/query";
import { createClient } from "@/modules/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { UpdateNewsForm } from "./components/update-news-form";
import { ButtonLink } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function Edit(props: TPageProps) {
  let params = await props.params;
  let client = await createClient();
  let slug = params.slug;

  if (!slug) redirect("/admin/news");

  let news = await getServerNewsDetail(client, slug);

  if (!news) notFound();

  return (
    <Fragment>
      <div className="pb-5">
        <ButtonLink href="/admin/news">
          <ArrowLeft /> Kembali
        </ButtonLink>

        <Title className="pt-2">{news.judul}</Title>
      </div>

      <UpdateNewsForm {...news} />
    </Fragment>
  );
}
