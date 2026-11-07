import { Forbidden, type CollectionConfig } from "payload";

import { isAdmin } from "@/access/isAdmin";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  access: {
    admin: isAdmin,
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req, context }) => {
        // Payload's first-register operation bypasses collection access checks.
        // Only trusted server-side setup may create an unauthenticated admin.
        if (
          operation === "create" &&
          req.user?.collection !== "users" &&
          context.bootstrapAdmin !== true
        ) {
          throw new Forbidden();
        }
        return data;
      },
    ],
  },
  fields: [],
};
