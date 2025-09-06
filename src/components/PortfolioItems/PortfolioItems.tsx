import { Entry } from "@interfaces/entry";

import PortfolioItem from "./PortfolioItem";

type Props = {
  items: Entry[];
};

export default function PortfolioItems({ items }: Props) {
  return (
    <section className="mx-auto max-w-6xl" id="work">
      <div className="px-5 py-15 md:grid md:grid-cols-2 md:gap-5">
        {items.map((item, index) => (
          <PortfolioItem {...item} key={index} />
        ))}
      </div>
    </section>
  );
}
