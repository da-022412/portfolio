import * as motion from "motion/react-client";

import { Entry } from "@interfaces/entry";

import PortfolioItem from "./PortfolioItem";

type Props = {
  items: Entry[];
};

export default function PortfolioItems({ items }: Props) {
  return (
    <motion.section
      className="mx-auto max-w-6xl"
      id="work"
      animate={{ opacity: [0, 1], y: [50, 0] }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-5 py-15 md:grid md:grid-cols-2 md:gap-5">
        {items.map((item, index) => (
          <PortfolioItem {...item} key={index} />
        ))}
      </div>
    </motion.section>
  );
}
