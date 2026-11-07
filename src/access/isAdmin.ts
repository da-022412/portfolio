import type { Access } from "payload";

export const isAdmin = (({ req: { user } }) =>
  user?.collection === "users") satisfies Access;
