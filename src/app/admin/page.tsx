import { Title } from "@/components/title";
import { Fragment } from "react";
import { DashboardCardsCounter } from "./components/dashboard-cards-counter";
import { createClient } from "@/modules/supabase/server";
import { getServerCounters } from "@/modules/dashboard/query";
import DashboardNewsList from "./components/dashboard-news-list";
import { getServerNews } from "@/modules/news/query";
import { getServerAspirations } from "@/modules/aspiration/query";
import DashboardAspirationList from "./components/dashboard-aspiration-list";

export default async function Admin() {
  let client = await createClient();
  let countersQuery = getServerCounters(client);
  let newsQuery = getServerNews(client, { limit: 5, page: 1 });
  let aspirationsQuery = getServerAspirations(client, { limit: 5, page: 1 });

  let [counters, news, aspirations] = await Promise.all([
    countersQuery,
    newsQuery,
    aspirationsQuery,
  ]);

  return (
    <Fragment>
      <Title>Dashboard</Title>

      <DashboardCardsCounter {...counters} />

      <section className="grid gap-4 lg:gap-2 xl:grid-cols-2 pt-4">
        <DashboardNewsList news={news.data ?? []} />
        <DashboardAspirationList aspirations={aspirations.data ?? []} />
      </section>
    </Fragment>
  );
}
