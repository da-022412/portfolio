import type { CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "order"],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "excerpt", type: "textarea" },
    { name: "body", type: "richText" },
    {
      name: "siteUrl",
      type: "text",
      label: "Live site",
      validate: (value: string | null | undefined) => {
        if (!value) return true;
        try {
          const url = new URL(value);
          if (url.protocol === "https:" || url.protocol === "http:") return true;
        } catch {
          // Return the same validation message for malformed and non-web URLs.
        }
        return "Enter a valid http:// or https:// URL.";
      },
    },
    { name: "coverImage", type: "text", required: true },
    { name: "order", type: "number", required: true },
  ],
};
