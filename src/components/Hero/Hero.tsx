import type { HeroProps } from "@interfaces/hero";

import HeroHome from "./HeroHome";
import HeroEntry from "./HeroEntry";

interface Props {
  hero: HeroProps["hero"];
}

const heroes = {
  home: HeroHome,
  entry: HeroEntry,
};

export const Hero: React.FC<Props> = ({ hero }) => {
  const HeroToRender = heroes[hero.type] as React.FC<typeof hero>;

  return <HeroToRender {...hero} />;
};
