import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardNewsListItem } from "./dashboard-news-list-item";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardNewsList(props: { news: Array<News> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Berita Terbaru</CardTitle>
        <CardDescription>
          Berikut adalah berita terbaru yang baru saja dibuat
        </CardDescription>

        <CardAction>
          <ButtonLink size="sm" variant="outline" href="/admin/news">
            Lihat daftar berita
            <ArrowRight />
          </ButtonLink>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="grid gap-3">
            {props.news.length > 0 &&
              props.news.map((n) => (
                <DashboardNewsListItem key={n.id} {...n} />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
