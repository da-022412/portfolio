import type { CollectionConfig } from "payload";

export const PortfolioItems: CollectionConfig = {
  slug: "portfolioItems",
  admin: {
    defaultColumns: ["title", "order", "updatedAt"],
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "link",
      type: "text",
      required: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
      admin: {
        step: 1,
      },
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      admin: {
        description: "Markdown body rendered on the portfolio detail page.",
        rows: 18,
      },
    },
  ],
};
