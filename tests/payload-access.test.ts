import assert from "node:assert/strict";
import test from "node:test";
import type { PayloadRequest } from "payload";

import { Projects } from "../src/collections/Projects";
import { Users } from "../src/collections/Users";

const request = (user: unknown = null) => ({ user }) as PayloadRequest;
const admin = { id: 1, email: "admin@example.test", collection: "users" };

for (const operation of ["create", "update", "delete"] as const) {
  test(`projects ${operation} requires an authenticated admin`, async () => {
    const access = Projects.access?.[operation];
    assert.ok(access);
    assert.equal(await access({ req: request() }), false);
    assert.equal(await access({ req: request({ collection: "other" }) }), false);
    assert.equal(await access({ req: request(admin) }), true);
  });
}

test("projects are publicly readable", async () => {
  const access = Projects.access?.read;
  assert.ok(access);
  assert.equal(await access({ req: request() }), true);
});

for (const operation of ["admin", "create", "read", "update", "delete", "unlock"] as const) {
  test(`users ${operation} is restricted to admins`, async () => {
    const access = Users.access?.[operation];
    assert.ok(access);
    assert.equal(await access({ req: request() }), false);
    assert.equal(await access({ req: request(admin) }), true);
  });
}

test("first-user registration cannot bypass the create restriction", () => {
  const hook = Users.hooks?.beforeChange?.[0];
  assert.ok(hook);
  const args = {
    collection: Users as Parameters<typeof hook>[0]["collection"],
    operation: "create",
    req: request(),
    context: {},
    data: { email: "attacker@example.test", context: { bootstrapAdmin: true } },
  } satisfies Parameters<typeof hook>[0];
  assert.throws(() => hook(args), { status: 403 });
  assert.deepEqual(hook({ ...args, context: { bootstrapAdmin: true } }), args.data);
  assert.deepEqual(hook({ ...args, req: request(admin) }), args.data);
});
