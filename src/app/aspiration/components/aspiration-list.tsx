import { ArticleCard } from "@/components/article-card";

export function AspirationList(props: { aspirations: Array<Aspiration> }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4">
      {props.aspirations.map((asp) => (
        <ArticleCard type="aspiration" {...asp} key={asp.id} />
      ))}
    </section>
  );
}
