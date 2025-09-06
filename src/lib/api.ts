import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

import { Entry } from "@interfaces/entry";

const portfolioItems = join(process.cwd(), "portfolio-items");

export function getEntrySlugs() {
  return fs.readdirSync(portfolioItems);
}

export function getEntryBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(portfolioItems, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { item: { ...data, content } } as Entry;

  /* TODO: Make dynamic
  return { item: { ...data, slug: realSlug, content } } as Entry; */
}

export function getAllEntries(): Entry[] {
  const slugs = getEntrySlugs();
  const entries = slugs
    .map((slug) => getEntryBySlug(slug))
    .sort((a, b) => (a.item.order > b.item.order ? 1 : -1));

  return entries;
}
