import { NewsListItem } from "./news-list-item";

export function NewsList(props: { news: Array<News> }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4">
      {props.news.map((news) => (
        <NewsListItem {...news} key={news.id} />
      ))}
    </section>
  );
}
