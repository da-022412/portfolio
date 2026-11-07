import { getAllEntries } from "@/lib/api";

import PortfolioItems from "@/components/PortfolioItems";
import Hero from "@components/Hero";

export const dynamic = "force-static";

export default async function Home() {
  const items = await getAllEntries();

  return (
    <main>
      <Hero hero={{ type: "home" }} />
      <PortfolioItems items={items} />
    </main>
  );
}
