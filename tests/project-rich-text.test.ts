import assert from "node:assert/strict";
import test from "node:test";

import type { Project } from "../src/payload-types";
import richTextToHtml from "../src/lib/richTextToHtml";

type Body = NonNullable<Project["body"]>;
type Node = Body["root"]["children"][number];

const textNode = (text: string): Node => ({
  type: "text",
  version: 1,
  text,
  format: 0,
  detail: 0,
  mode: "normal",
  style: "",
});

const paragraph = (...children: Node[]): Node => ({
  type: "paragraph",
  version: 1,
  format: "",
  indent: 0,
  direction: null,
  children,
});

const body = (...children: Node[]): Body => ({
  root: {
    type: "root",
    version: 1,
    format: "",
    indent: 0,
    direction: null,
    children,
  },
});

test("renders Payload headings and paragraphs without a wrapper", () => {
  const content = body(
    {
      type: "heading",
      version: 1,
      tag: "h3",
      format: "",
      indent: 0,
      direction: null,
      children: [textNode("Overview")],
    },
    paragraph(textNode("Project description.")),
  );

  assert.equal(
    richTextToHtml(content),
    "<h3>Overview</h3>\n<p>Project description.</p>\n",
  );
});

test("preserves line breaks and newlines in Payload content", () => {
  const content = body(
    paragraph(
      textNode("First line"),
      { type: "linebreak", version: 1 },
      textNode("Second line\ncontinues here"),
    ),
  );

  assert.equal(
    richTextToHtml(content),
    "<p>First line<br>\nSecond line\ncontinues here</p>\n",
  );
});

test("missing or empty rich text renders an empty body", () => {
  assert.equal(richTextToHtml(null), "");
  assert.equal(richTextToHtml(undefined), "");
  assert.equal(richTextToHtml(body()), "");
});

test("rich text escapes HTML in text nodes", () => {
  const rendered = richTextToHtml(
    body(paragraph(textNode('<script>alert("x")</script> & text'))),
  );

  assert.ok(!rendered.includes("<script>"));
  assert.ok(rendered.includes("&lt;script&gt;"));
  assert.ok(rendered.includes("&amp; text"));
});
