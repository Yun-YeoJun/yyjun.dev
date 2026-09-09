import { test } from "node:test";
import assert from "node:assert/strict";
import type { Root } from "hast";
import rehypeResponsiveTables from "../src/utils/rehypeResponsiveTables.ts";

test("wraps Markdown tables in a horizontal scroll container", () => {
  const paragraph = {
    type: "element" as const,
    tagName: "p",
    properties: {},
    children: [{ type: "text" as const, value: "설명" }],
  };
  const firstTable = {
    type: "element" as const,
    tagName: "table",
    properties: {},
    children: [],
  };
  const secondTable = structuredClone(firstTable);
  const tree: Root = {
    type: "root",
    children: [paragraph, firstTable, secondTable],
  };

  rehypeResponsiveTables()(tree);

  assert.deepEqual(tree.children, [
    paragraph,
    {
      type: "element",
      tagName: "div",
      properties: {
        className: [
          "relative",
          "my-8",
          "w-full",
          "overflow-x-auto",
          "[&_table]:my-0",
          "[&_table]:min-w-xl",
        ],
      },
      children: [firstTable],
    },
    {
      type: "element",
      tagName: "div",
      properties: {
        className: [
          "relative",
          "my-8",
          "w-full",
          "overflow-x-auto",
          "[&_table]:my-0",
          "[&_table]:min-w-xl",
        ],
      },
      children: [secondTable],
    },
  ]);
});
