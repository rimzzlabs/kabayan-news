import { Title } from "@/components/title";
import { getServerNews } from "@/modules/news/query";
import { createClient } from "@/modules/supabase/server";
import { NewsList } from "./components/news-list";
import { toInt } from "radash";

export default async function Home(props: TPageProps) {
  let params = await props.searchParams;
  let client = await createClient();

  let page = toInt(params.page, 1);

  let newsQuery = await getServerNews(client, {
    status: "published",
    limit: 10,
    page,
  });

  return (
    <div className="pt-8 pb-8">
      <Title className="pb-4">
        Berita Terkini<span className="sr-only">Kabayan News</span>
      </Title>

      <NewsList
        news={newsQuery.data ?? []}
        count={newsQuery.count ?? 0}
        page={page}
        limit={10}
      />
    </div>
  );
}
