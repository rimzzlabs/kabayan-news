import { Title } from "@/components/title";
import { getServerNews } from "@/modules/news/query";
import { createClient } from "@/modules/supabase/server";
import { toInt } from "radash";
import { Fragment } from "react";
import { NewsTable } from "./components/news-table";
import { ButtonLink } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default async function News(props: TPageProps) {
  let params = await props.searchParams;

  let page = toInt(params.page, 1);
  let limit = toInt(params.limit, 10);

  let client = await createClient();
  let newsQuery = await getServerNews(client, { limit, page });

  return (
    <Fragment>
      <div className="pb-5 flex items-center gap-2">
        <Title>Daftar Berita</Title>

        <ButtonLink className="ml-auto" href="/admin/news/new">
          <PlusIcon />
          Buat berita
        </ButtonLink>
      </div>

      <NewsTable
        page={page}
        news={newsQuery.data ?? []}
        count={newsQuery.count ?? 0}
      />
    </Fragment>
  );
}
