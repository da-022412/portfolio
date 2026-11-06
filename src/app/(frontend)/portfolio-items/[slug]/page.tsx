import { getAllEntries, getEntryBySlug } from "@/lib/api";

import { notFound } from "next/navigation";

import markdownToHtml from "@/lib/markdownToHtml";

import HeroEntry from "@components/Hero/HeroEntry";
import EntryBody from "@components/EntryBody";

export default async function Entry(props: Params) {
  const params = await props.params;
  const entry = getEntryBySlug(params.slug);

  if (!entry) {
    return notFound();
  }

  const content = await markdownToHtml(entry.item.content || "");

  return (
    <main>
      <HeroEntry item={entry.item} />
      <EntryBody content={content} link={entry.item.link} />
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const entries = getAllEntries();

  return entries.map((entry) => ({
    slug: entry.item.slug,
  }));
}
