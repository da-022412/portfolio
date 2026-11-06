import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

import { Projects } from "@/collections/Projects";
import { Users } from "@/collections/Users";

const baseDir = dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: "users",
    importMap: { baseDir },
  },
  collections: [Projects, Users],
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    disableCreateDatabase: true,
    migrationDir: resolve(baseDir, "migrations"),
    // Schema changes are explicit migrations, including in development.
    push: false,
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: { outputFile: resolve(baseDir, "payload-types.ts") },
});
