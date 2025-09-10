import { Title } from "@/components/title";
import { getServerAspirations } from "@/modules/aspiration/query";
import { createClient } from "@/modules/supabase/server";
import { AspirationList } from "./components/aspiration-list";
import { ButtonLink } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { F, O, pipe } from "@mobily/ts-belt";
import { toInt } from "radash";

export default async function Aspiration(props: TPageProps) {
  let params = await props.searchParams;
  let client = await createClient();
  let session = await client.auth.getSession();

  let page = toInt(params.page, 1);
  let res = await getServerAspirations(client, { page, limit: 10 });

  let authenticated = false;

  if (session.data.session) {
    authenticated = true;
  }

  let aspirations = pipe(
    res.data,
    O.fromNullable,
    O.mapWithDefault([], F.identity),
    F.toMutable,
  );

  return (
    <section className="py-8">
      <div className="flex items-center justify-between gap-2 pb-6">
        <Title>Aspirasi Warga</Title>

        {authenticated && (
          <ButtonLink href="/aspiration/new">
            <Plus />
            Buat aspirasi
          </ButtonLink>
        )}
      </div>

      <AspirationList
        limit={10}
        page={page}
        count={res.count ?? 0}
        aspirations={aspirations}
      />
    </section>
  );
}
