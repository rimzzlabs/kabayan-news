import { Fragment } from "react";
import { CategoryTable } from "./components/category-table";
import { Title } from "@/components/title";
import { createClient } from "@/modules/supabase/server";
import { getServerCategories } from "@/modules/category/query";
import { toInt } from "radash";
import { CategoryCreateButton } from "./components/category-create-button";

export default async function Category(props: TPageProps) {
  let params = await props.searchParams;
  let client = await createClient();

  let page = toInt(params.page, 1);
  let categories = await getServerCategories(client, { limit: 10, page });

  return (
    <Fragment>
      <div className="pb-5 flex items-center gap-2">
        <Title>Daftar Kategori</Title>

        <CategoryCreateButton />
      </div>

      <CategoryTable
        initialPage={page}
        count={categories.count ?? 0}
        categories={categories.data ?? []}
      />
    </Fragment>
  );
}
