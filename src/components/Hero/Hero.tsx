import HeroHome from "./HeroHome";

interface Props {
  hero: {
    type: "home";
  };
}

const heroes = {
  home: HeroHome,
};

export const Hero: React.FC<Props> = ({ hero }) => {
  const HeroToRender = heroes[hero.type] as React.FC<typeof hero>;

  return <HeroToRender {...hero} />;
};
