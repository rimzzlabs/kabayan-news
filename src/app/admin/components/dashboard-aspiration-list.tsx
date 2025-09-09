import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardAspirationListItem } from "./dashboard-aspiration-list-item";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardAspirationList(props: {
  aspirations: Array<Aspiration>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aspirasi Terbaru</CardTitle>
        <CardDescription>
          Berikut adalah daftar aspirari terbaru yang baru saja dibuat oleh
          warga
        </CardDescription>
        <CardAction>
          <ButtonLink size="sm" variant="outline" href="/admin/aspiration">
            Lihat daftar aspirasi
            <ArrowRight />
          </ButtonLink>
        </CardAction>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="grid gap-3">
            {props.aspirations.length > 0 &&
              props.aspirations.map((n) => (
                <DashboardAspirationListItem key={n.id} {...n} />
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
