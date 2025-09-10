import { Title } from "@/components/title";
import { Fragment } from "react";
import { CreateNewsForm } from "./components/create-news-form";
import { ButtonLink } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateNews() {
  return (
    <Fragment>
      <div className="pb-5">
        <ButtonLink variant="outline" href="/admin/news">
          <ArrowLeft /> Kembali
        </ButtonLink>

        <Title className="pt-2">Buat berita baru</Title>
      </div>

      <CreateNewsForm />
    </Fragment>
  );
}
