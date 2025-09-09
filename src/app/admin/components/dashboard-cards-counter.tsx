import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2Icon,
  HourglassIcon,
  InboxIcon,
  NewspaperIcon,
} from "lucide-react";

export function DashboardCardsCounter(props: DashboardCardsCounterProps) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] gap-4 pt-4">
      <Card>
        <CardHeader>
          <div className="inline-flex items-center gap-2">
            <div className="p-2 rounded-md bg-sky-50">
              <NewspaperIcon className="size-4 stroke-sky-700" />
            </div>
            <CardTitle className="text-xl">{props.news}</CardTitle>
          </div>
          <CardDescription>Total Berita</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="inline-flex items-center gap-2">
            <div className="p-2 rounded-md bg-amber-50">
              <InboxIcon className="size-4 stroke-amber-600" />
            </div>
            <CardTitle className="text-xl">{props.aspiration}</CardTitle>
          </div>
          <CardDescription>Aspirasi Masuk</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="inline-flex items-center gap-2">
            <div className="p-2 rounded-md bg-yellow-50">
              <HourglassIcon className="size-4 stroke-yellow-600" />
            </div>
            <CardTitle className="text-xl">
              {props.aspirationProcessed}
            </CardTitle>
          </div>
          <CardDescription>Aspirasi Diproses</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="inline-flex items-center gap-2">
            <div className="p-2 rounded-md bg-emerald-50">
              <CheckCircle2Icon className="size-4 stroke-emerald-600" />
            </div>
            <CardTitle className="text-xl">
              {props.aspirationCompleted}
            </CardTitle>
          </div>
          <CardDescription>Aspirasi Selesai</CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}
