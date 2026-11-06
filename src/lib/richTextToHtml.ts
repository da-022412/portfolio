import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from "@payloadcms/richtext-lexical/html";

import type { Project } from "@/payload-types";

const converters: HTMLConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  paragraph: ({ node, nodesToHTML, providedStyleTag }) =>
    `<p${providedStyleTag}>${nodesToHTML({ nodes: node.children }).join("")}</p>\n`,
  heading: ({ node, nodesToHTML, providedStyleTag }) => {
    const tag = /^h[1-6]$/.test(node.tag) ? node.tag : "h3";
    return `<${tag}${providedStyleTag}>${nodesToHTML({ nodes: node.children }).join("")}</${tag}>\n`;
  },
  linebreak: "<br>\n",
});

export default function richTextToHtml(body: Project["body"]): string {
  if (!body) return "";

  return convertLexicalToHTML({
    data: body,
    disableContainer: true,
    converters,
  });
}
