import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import type { Project } from "../src/payload-types";
import {
  parseProject,
  readProjects,
  upsertProjects,
  type ImportedProject,
} from "../scripts/lib/project-import";

const projects = await readProjects("_portfolio-items");
const source = readFileSync(
  "_portfolio-items/pinebridge-investments.md",
  "utf8",
);

test("all eight projects retain source slugs, field mappings, and displayed order", () => {
  assert.deepEqual(
    projects.map((project) => project.slug),
    [
      "pinebridge-investments",
      "colonial-williamsburg",
      "usc",
      "ciis",
      "purdue-global-law-school",
      "saic",
      "cmua",
      "abbott-labs",
    ],
  );
  assert.equal(projects[0].siteUrl, "https://www.pinebridge.com/");
  assert.equal(projects[0].coverImage, "/images/Pinebridge.webp");
  assert.deepEqual(
    Object.keys(projects[0]).sort(),
    [
      "title",
      "slug",
      "excerpt",
      "body",
      "siteUrl",
      "coverImage",
      "order",
    ].sort(),
  );
  assert.ok(!("link" in projects[0]));
});

test("slug comes from the filename, regardless of frontmatter", async () => {
  const doc = await parseProject(
    "exact-slug.md",
    source.replace("title: ", "slug: wrong-slug\ntitle: "),
  );
  assert.equal(doc.slug, "exact-slug");
});

test("absent optional fields map to null", async () => {
  const doc = await parseProject(
    "optional.md",
    source.replace(/^excerpt:.*\n/m, "").replace(/^link:.*\n/m, ""),
  );
  assert.equal(doc.excerpt, null);
  assert.equal(doc.siteUrl, null);
});

test("invalid fields and unsupported Markdown fail preflight with a filename", async () => {
  for (const invalid of [
    source.replace('title: "PineBridge Investments"', 'title: ""'),
    source.replace("order: 1", 'order: "1"'),
    source.replace("https://www.pinebridge.com/", "javascript:alert(1)"),
    source + "\n- Unsupported list\n",
    source + "\n**Unsupported formatting**\n",
  ]) {
    await assert.rejects(
      parseProject("bad-project.md", invalid),
      /bad-project\.md:/,
    );
  }
});

function reorderKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(reorderKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .reverse()
        .map(([key, child]) => [key, reorderKeys(child)]),
    );
  }
  return value;
}

function fakePayload() {
  const docs = new Map<string, Project>();
  let writes = 0;
  let failAt = Infinity;
  const write = () => {
    writes++;
    if (writes === failAt) throw new Error("Simulated interruption");
  };
  const payload = {
    async find(args: {
      collection: string;
      where: { slug: { equals: string } };
      limit: number;
      overrideAccess: boolean;
    }) {
      assert.equal(args.collection, "projects");
      assert.equal(args.limit, 1);
      assert.equal(args.overrideAccess, true);
      const doc = docs.get(args.where.slug.equals);
      return { docs: doc ? [doc] : [] };
    },
    async create(args: {
      data: ImportedProject;
      overrideAccess: boolean;
      context: { disableRevalidate: boolean };
    }) {
      assert.equal(args.overrideAccess, true);
      assert.equal(args.context.disableRevalidate, true);
      write();
      assert.ok(!docs.has(args.data.slug), "must not create duplicate slugs");
      const doc = {
        ...args.data,
        id: docs.size + 1,
        createdAt: "original",
        updatedAt: "original",
      } as Project;
      docs.set(doc.slug, doc);
      return doc;
    },
    async update(args: {
      id: number;
      data: ImportedProject;
      overrideAccess: boolean;
      context: { disableRevalidate: boolean };
    }) {
      assert.equal(args.overrideAccess, true);
      assert.equal(args.context.disableRevalidate, true);
      write();
      const existing = docs.get(args.data.slug);
      assert.equal(existing?.id, args.id);
      const doc = { ...existing, ...args.data } as Project;
      docs.set(doc.slug, doc);
      return doc;
    },
  };
  return {
    payload: payload as unknown as Parameters<typeof upsertProjects>[0],
    docs,
    writes: () => writes,
    failOnWrite: (index: number) => {
      failAt = index;
    },
  };
}

test("import creates once, skips equivalent JSON, and updates only changed source fields", async () => {
  const fake = fakePayload();
  const logs: string[] = [];
  assert.deepEqual(
    await upsertProjects(fake.payload, projects, (line) => logs.push(line)),
    { created: 8, updated: 0, skipped: 0 },
  );
  for (const doc of fake.docs.values())
    doc.body = reorderKeys(doc.body) as Project["body"];
  assert.deepEqual(
    await upsertProjects(fake.payload, projects, (line) => logs.push(line)),
    { created: 0, updated: 0, skipped: 8 },
  );
  assert.equal(fake.writes(), 8, "an unchanged rerun must not write");
  const changed = projects.map((doc, index) =>
    index === 0 ? { ...doc, title: "Updated title" } : doc,
  );
  assert.deepEqual(
    await upsertProjects(fake.payload, changed, (line) => logs.push(line)),
    { created: 0, updated: 1, skipped: 7 },
  );
  assert.equal(fake.docs.size, 8);
  assert.equal(fake.docs.get(projects[0].slug)?.createdAt, "original");
  assert.ok(logs.some((line) => line.startsWith("CREATE ")));
  assert.ok(logs.some((line) => line.startsWith("SKIP ")));
  assert.ok(logs.some((line) => line.startsWith("UPDATE ")));
});

test("an interrupted import resumes without duplicate projects", async () => {
  const fake = fakePayload();
  fake.failOnWrite(2);
  await assert.rejects(
    upsertProjects(fake.payload, projects, () => {}),
    /Simulated interruption/,
  );
  fake.failOnWrite(Infinity);
  assert.deepEqual(await upsertProjects(fake.payload, projects, () => {}), {
    created: 7,
    updated: 0,
    skipped: 1,
  });
  assert.equal(fake.docs.size, 8);
});
