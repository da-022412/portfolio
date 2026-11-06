import config from "@payload-config";
import { getPayload } from "payload";

import type { Entry } from "@interfaces/entry";
import type { Project } from "@/payload-types";
import richTextToHtml from "@/lib/richTextToHtml";

function toEntry(project: Project): Entry {
  return {
    item: {
      title: project.title,
      slug: project.slug,
      excerpt: project.excerpt ?? "",
      coverImage: project.coverImage,
      link: project.siteUrl ?? "",
      content: richTextToHtml(project.body),
      order: project.order,
    },
  };
}

export async function getEntryBySlug(slug: string): Promise<Entry | null> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    overrideAccess: false,
  });

  return docs[0] ? toEntry(docs[0]) : null;
}

export async function getAllEntries(): Promise<Entry[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "projects",
    // Preserve the existing order, including CMUA before Abbott for order 7.
    sort: ["order", "-slug"],
    depth: 0,
    pagination: false,
    limit: 0,
    overrideAccess: false,
  });

  return docs.map(toEntry);
}
