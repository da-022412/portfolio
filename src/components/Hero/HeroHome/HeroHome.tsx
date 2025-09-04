import LogoShowcase from "./LogoShowcase";

import Image from "next/image";

export default function HeroHome() {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="px-5 py-15">
        <div className="mb-5">
          <h1 className="mb-2 text-xl">Dennis Acosta —</h1>
          <p className="text-4xl/10">
            Front-end engineer focused on building fast, reliable, and scalable
            applications with a great user experience.
          </p>
        </div>
        <div>
          <Image
            src="/images/DA_hero.webp"
            alt="Hero Image"
            width={450}
            height={450}
            className="object-contain"
            priority
          />
        </div>

        <LogoShowcase />
      </div>
    </section>
  );
}
