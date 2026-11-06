import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { remark } from "remark";

import type { Project } from "../src/payload-types";
import markdownToHtml from "../src/lib/markdownToHtml";
import richTextToHtml from "../src/lib/richTextToHtml";

// Independently construct Lexical fixtures for the nodes in the current source.
// Keep soft newlines in text nodes: the stock Markdown importer collapses them.
function bodyFixture(markdown: string): NonNullable<Project["body"]> {
  const blocks = remark().parse(markdown).children;
  return {
    root: {
      type: "root",
      version: 1,
      format: "",
      indent: 0,
      direction: null,
      children: blocks.map((block) => {
        if (block.type !== "paragraph" && block.type !== "heading") {
          throw new Error(`Add a fixture for source node: ${block.type}`);
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
            if (child.type !== "text")
              throw new Error(`Add a fixture for inline node: ${child.type}`);
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

for (const file of readdirSync("_portfolio-items")) {
  test(`${file}: rich text preserves the current body HTML exactly`, async () => {
    const { content } = matter(
      readFileSync(join("_portfolio-items", file), "utf8"),
    );
    assert.equal(
      richTextToHtml(bodyFixture(content)),
      await markdownToHtml(content),
    );
  });
}

test("missing or empty rich text renders an empty body", () => {
  assert.equal(richTextToHtml(null), "");
  assert.equal(richTextToHtml(undefined), "");
  assert.equal(richTextToHtml(bodyFixture("")), "");
});

test("rich text escapes HTML in text nodes", () => {
  const body = bodyFixture("Plain text");
  const paragraph = body.root.children[0];
  const text = (paragraph.children as { text: string }[])[0];
  text.text = '<script>alert("x")</script> & text';
  const rendered = richTextToHtml(body);
  assert.ok(!rendered.includes("<script>"));
  assert.ok(rendered.includes("&lt;script&gt;"));
  assert.ok(rendered.includes("&amp; text"));
});
