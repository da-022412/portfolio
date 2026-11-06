import { getAllEntries } from "@/lib/api";

import PortfolioItems from "@/components/PortfolioItems";
import Hero from "@components/Hero";

export default function Home() {
  const items = getAllEntries();

  return (
    <main>
      <Hero hero={{ type: "home" }} />
      <PortfolioItems items={items} />
    </main>
  );
}
