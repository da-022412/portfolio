import { getPayload } from "payload";

import config from "../src/payload.config";

const email = process.env.PAYLOAD_ADMIN_EMAIL;
const password = process.env.PAYLOAD_ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD for this command.");
}
if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
  throw new Error("Configure DATABASE_URL and PAYLOAD_SECRET before creating an admin.");
}

const payload = await getPayload({ config });
try {
  const { totalDocs } = await payload.count({ collection: "users" });
  if (totalDocs > 0) {
    throw new Error("An admin already exists. Manage users through /admin.");
  }
  await payload.create({
    collection: "users",
    data: { email, password },
    overrideAccess: true,
    context: { bootstrapAdmin: true },
  });
  payload.logger.info("Initial admin created. Sign in at /admin.");
} finally {
  await payload.destroy();
}
