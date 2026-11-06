import { resolve } from "node:path";
import { loadEnv } from "payload/node";

import { readProjects, upsertProjects } from "./lib/project-import";

loadEnv();
const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--dry-run") || args.length > 1) {
  throw new Error("Usage: npm run seed:projects -- [--dry-run]");
}
const projects = await readProjects(resolve(process.cwd(), "_portfolio-items"));
console.log(
  `Validated ${projects.length} projects; all body HTML matches the Markdown renderer.`,
);

if (args.includes("--dry-run")) {
  for (const project of projects) console.log(`VALIDATED ${project.slug}`);
  console.log(
    "Dry run complete. No database connection opened and no content written.",
  );
} else {
  if (
    !process.env.DATABASE_URL ||
    !process.env.PAYLOAD_SECRET ||
    process.env.PAYLOAD_SECRET === "[SENSITIVE]"
  ) {
    throw new Error(
      "Configure DATABASE_URL and a valid PAYLOAD_SECRET for the intended database before importing.",
    );
  }
  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });
  try {
    const counts = await upsertProjects(payload, projects, (message) =>
      payload.logger.info(message),
    );
    payload.logger.info(
      `Import complete: ${counts.created} created, ${counts.updated} updated, ${counts.skipped} skipped.`,
    );
    payload.logger.info(
      "Redeploy or rebuild the frontend to refresh static pages; this standalone import skips request-only revalidation.",
    );
  } finally {
    await payload.destroy();
    await new Promise<void>((resolve, reject) => {
      payload.logger.flush((error) => (error ? reject(error) : resolve()));
    });
  }
}

// Match Payload's CLI lifecycle: the PostgreSQL adapter retains a listener
// connection after destroy(), so a completed one-off command must exit explicitly.
process.exit(0);
