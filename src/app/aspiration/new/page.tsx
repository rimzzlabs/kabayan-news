import { Title } from "@/components/title";
import { CreateAspirationForm } from "./components/create-aspiration-form";
import { RecentAspirationList } from "./components/recent-aspiration-list";

export default function NewAspiration() {
  return (
    <section className="py-4">
      <Title className="pb-6 lg:pb-2 lg:text-3xl">Kirim Aspirasi</Title>

      <div className="grid gap-6 xl:grid-cols-5 w-full">
        <CreateAspirationForm />
        <RecentAspirationList />
      </div>
    </section>
  );
}
