import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Project } from "@/payload-types";

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  context,
}) => {
  if (context.disableRevalidate) return doc;

  revalidatePath("/");
  revalidatePath(`/portfolio-items/${doc.slug}`);
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/portfolio-items/${previousDoc.slug}`);
  }

  return doc;
};

export const revalidateDeletedProject: CollectionAfterDeleteHook<Project> = ({
  doc,
  context,
}) => {
  if (context.disableRevalidate) return doc;

  revalidatePath("/");
  revalidatePath(`/portfolio-items/${doc.slug}`);

  return doc;
};
