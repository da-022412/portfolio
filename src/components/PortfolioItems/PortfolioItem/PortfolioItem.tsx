import { Entry } from "@interfaces/entry";

import Image from "next/image";
import Link from "next/link";

type Props = {
  item: Entry["item"];
};

export default function PortfolioItem({ item }: Props) {
  return (
    <Link
      href={item.slug}
      target="_blank"
      className="group block not-last:mb-5 focus:outline-2 focus:outline-offset-0 focus:outline-black md:not-last:mb-0"
    >
      <article className="relative h-full overflow-hidden bg-neutral-100 px-5 pt-5 pb-[calc(100%+1.25rem)] shadow-md transition duration-300 ease-in-out group-hover:shadow-xl md:px-10 md:pt-10">
        <div className="mb-2">
          <h3 className="text-2xl/7">{item.title}</h3>
        </div>
        <div>
          <p className="text-base">{item.excerpt}</p>
        </div>
        <div className="mt-5">
          <span>View Project &#8594;</span>
        </div>
        <div className="absolute -right-5 bottom-0 aspect-square w-lg max-w-full">
          <Image
            src={item.coverImage}
            alt={item.title}
            width={500}
            height={500}
            className="h-full object-cover object-center"
          />
        </div>
      </article>
    </Link>
  );
}
