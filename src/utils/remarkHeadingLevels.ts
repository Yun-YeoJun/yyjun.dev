import type { Heading, Root } from "mdast";
import { visit } from "unist-util-visit";

/** Reserve h1 for the page title; HTML heading levels stop at h6. */
export default function remarkHeadingLevels() {
  return (tree: Root) => {
    visit(tree, "heading", heading => {
      heading.depth = Math.min(heading.depth + 1, 6) as Heading["depth"];
    });
  };
}
