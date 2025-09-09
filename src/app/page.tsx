import { Title } from "@/components/title";
import { getServerNews } from "@/modules/news/query";
import { createClient } from "@/modules/supabase/server";
import { NewsList } from "./components/news-list";

export default async function Home() {
  let client = await createClient();
  let news = await getServerNews(client);

  return (
    <div className="pt-8 pb-8">
      <Title className="pb-4">
        Berita Terkini<span className="sr-only">Kabayan News</span>
      </Title>

      <NewsList news={news} />
    </div>
  );
}
