import { Title } from "@/components/title";
import { Fragment } from "react";
import { AspirationTable } from "./components/aspiration-table";
import { createClient } from "@/modules/supabase/server";
import { toInt } from "radash";
import { getServerAspirations } from "@/modules/aspiration/query";

export default async function Aspiration(props: TPageProps) {
  let params = await props.searchParams;
  let client = await createClient();

  let page = toInt(params.page, 1);

  let aspirationsQuery = await getServerAspirations(client, {
    limit: 10,
    page,
  });

  return (
    <Fragment>
      <Title className="pb-5">Daftar Berita</Title>

      <AspirationTable
        page={page}
        aspirations={aspirationsQuery.data ?? []}
        count={aspirationsQuery.count ?? 0}
      />
    </Fragment>
  );
}
