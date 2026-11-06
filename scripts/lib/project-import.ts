import { isDeepStrictEqual } from "node:util";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import type { Payload } from "payload";

import type { Project } from "../../src/payload-types";
import markdownToHtml from "../../src/lib/markdownToHtml";
import richTextToHtml from "../../src/lib/richTextToHtml";

const sourceFields = [
  "title",
  "slug",
  "excerpt",
  "body",
  "siteUrl",
  "coverImage",
  "order",
] as const;

export type ImportedProject = Pick<Project, (typeof sourceFields)[number]>;

export function markdownToProjectBody(
  markdown: string,
): NonNullable<Project["body"]> {
  return {
    root: {
      type: "root",
      version: 1,
      format: "",
      indent: 0,
      direction: null,
      children: remark()
        .parse(markdown)
        .children.map((block) => {
          if (block.type !== "paragraph" && block.type !== "heading") {
            throw new Error(`Unsupported Markdown block: ${block.type}`);
          }
          return {
            type: block.type,
            version: 1,
            format: "",
            indent: 0,
            direction: null,
            ...(block.type === "heading" ? { tag: `h${block.depth}` } : {}),
            children: block.children.map((child) => {
              if (child.type === "break")
                return { type: "linebreak", version: 1 };
              if (child.type !== "text") {
                throw new Error(
                  `Unsupported Markdown inline node: ${child.type}`,
                );
              }
              // Retain soft newlines as text, rather than changing them to spaces.
              return {
                type: "text",
                version: 1,
                text: child.value,
                format: 0,
                detail: 0,
                mode: "normal",
                style: "",
              };
            }),
          };
        }),
    },
  };
}

function requiredText(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} must be a nonempty string`);
  }
  return value;
}

function optionalText(value: unknown, field: string): string | null {
  if (value == null) return null;
  if (typeof value !== "string") throw new Error(`${field} must be text`);
  return value;
}

export async function parseProject(
  file: string,
  source: string,
): Promise<ImportedProject> {
  try {
    const { data, content } = matter(source);
    const slug = basename(file, ".md");
    if (!slug) throw new Error("Missing filename slug");
    const title = requiredText(data.title, "title");
    const coverImage = requiredText(data.coverImage, "coverImage");
    const excerpt = optionalText(data.excerpt, "excerpt");
    const siteUrl = optionalText(data.link, "link") || null;
    if (siteUrl) {
      const url = new URL(siteUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error("link must be an HTTP(S) URL");
      }
    }
    if (typeof data.order !== "number" || !Number.isFinite(data.order)) {
      throw new Error("order must be a finite number");
    }
    const body = markdownToProjectBody(content);
    if (richTextToHtml(body) !== (await markdownToHtml(content))) {
      throw new Error("Rich-text conversion changes the existing body HTML");
    }
    return {
      title,
      slug,
      excerpt,
      body,
      siteUrl,
      coverImage,
      order: data.order,
    };
  } catch (error) {
    throw new Error(
      `${file}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function readProjects(
  directory: string,
): Promise<ImportedProject[]> {
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((file) => file.isFile() && file.name.endsWith(".md"))
    .map((file) => file.name)
    .sort();
  if (!files.length)
    throw new Error(`No Markdown projects found in ${directory}`);

  // Preflight every file before opening a database connection or writing anything.
  const projects = await Promise.all(
    files.map(async (file) =>
      parseProject(file, await readFile(join(directory, file), "utf8")),
    ),
  );
  return projects.sort(
    (a, b) => a.order - b.order || b.slug.localeCompare(a.slug),
  );
}

export async function upsertProjects(
  payload: Pick<Payload, "find" | "create" | "update">,
  projects: ImportedProject[],
  log: (message: string) => void,
) {
  const counts = { created: 0, updated: 0, skipped: 0 };
  for (const project of projects) {
    const { docs } = await payload.find({
      collection: "projects",
      where: { slug: { equals: project.slug } },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    });
    const existing = docs[0];
    if (
      existing &&
      sourceFields.every((field) =>
        isDeepStrictEqual(existing[field] ?? null, project[field] ?? null),
      )
    ) {
      counts.skipped++;
      log(`SKIP ${project.slug} (unchanged)`);
      continue;
    }

    const args = {
      collection: "projects" as const,
      data: project,
      overrideAccess: true,
      context: { disableRevalidate: true },
    };
    if (existing) {
      await payload.update({ ...args, id: existing.id });
      counts.updated++;
      log(`UPDATE ${project.slug}`);
    } else {
      await payload.create(args);
      counts.created++;
      log(`CREATE ${project.slug}`);
    }
  }
  return counts;
}
