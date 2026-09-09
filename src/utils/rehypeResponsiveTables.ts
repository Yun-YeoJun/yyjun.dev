import type { Element, Root } from "hast";
import { SKIP, visit } from "unist-util-visit";

const responsiveTableClasses = [
  "relative",
  "my-8",
  "w-full",
  "overflow-x-auto",
  "[&_table]:my-0",
  "[&_table]:min-w-xl",
];

export default function rehypeResponsiveTables() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "table" || index === undefined || !parent) return;

      (parent as Root | Element).children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: responsiveTableClasses },
        children: [node],
      };

      return SKIP;
    });
  };
}
