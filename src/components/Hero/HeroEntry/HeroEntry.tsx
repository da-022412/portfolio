import * as motion from "motion/react-client";

import { Entry as Props } from "@/interfaces/entry";

const HeroEntry = ({ item: { title, excerpt } }: Props) => {
  return (
    <section className="h-60 bg-neutral-100 md:h-96">
      <motion.div
        className="mx-auto flex h-full max-w-3xl flex-col justify-center"
        animate={{ opacity: [0, 1], y: [50, 0] }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 py-6">
          <div>
            <h1 className="text-4xl/10">{title}</h1>
          </div>
          <div className="mt-2">
            <p>{excerpt}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroEntry;
