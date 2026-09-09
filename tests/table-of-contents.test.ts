import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

test("hides the table of contents below the desktop breakpoint", async () => {
  const component = await readFile(
    new URL("../src/components/TableOfContents.astro", import.meta.url),
    "utf8"
  );

  assert.match(
    component,
    /@media \(max-width: 79\.999rem\)\s*\{\s*\.toc-container\s*\{\s*display: none;/s
  );
});
