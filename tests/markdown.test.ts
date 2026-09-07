import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Root, Link, Paragraph } from "mdast";
import remarkContentLinks from "../src/utils/remarkContentLinks.ts";

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "blog-markdown-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "posts"));
  writeFileSync(
    join(root, "posts/next.md"),
    "---\ntitle: 다음\npubDatetime: 2020-01-01\n---\n## 시작\n"
  );
  return root;
}
async function transform(root: string, source: string, base = "/") {
  const processor = unified()
    .use(remarkParse)
    .use(remarkContentLinks, { contentRoot: root, base });
  return (await processor.run(processor.parse(source), {
    path: join(root, "posts/first.md"),
  })) as Root;
}

test("resolves Markdown links with query and fragment under a deployment base", async t => {
  const tree = await transform(
    fixture(t),
    "[다음](next.md?from=first#시작)",
    "/blog"
  );
  assert.equal(
    ((tree.children[0] as Paragraph).children[0] as Link).url,
    "/blog/posts/next/?from=first#시작"
  );
});
test("resolves reference-style Markdown links", async t => {
  const tree = await transform(fixture(t), "[다음][next]\n\n[next]: next.md");
  assert.equal((tree.children[1] as { url: string }).url, "/posts/next/");
});
test("does not change external Markdown links or code examples", async t => {
  const tree = await transform(
    fixture(t),
    "[외부](https://example.org/readme.md)\n\n`[[example]]`\n\n```md\n![[example]]\n```"
  );
  assert.equal(
    ((tree.children[0] as Paragraph).children[0] as Link).url,
    "https://example.org/readme.md"
  );
});
test("rejects missing, draft, future and out-of-vault Markdown targets", async t => {
  const root = fixture(t);
  for (const frontmatter of ["draft: true", "pubDatetime: 2099-01-01"]) {
    writeFileSync(
      join(root, "posts/hidden.md"),
      `---\n${frontmatter}\n---\n숨김`
    );
    await assert.rejects(transform(root, "[숨김](hidden.md)"), /공개되지 않은/);
  }
  await assert.rejects(transform(root, "[없음](missing.md)"), /찾을 수 없/);
  await assert.rejects(transform(root, "[바깥](../../outside.md)"), /보관함/);
});
test("rejects Obsidian-only syntax in prose, while leaving ordinary brackets alone", async t => {
  const root = fixture(t);
  await assert.rejects(transform(root, "[[다음]]"), /표준 Markdown/);
  await assert.rejects(transform(root, "> [!NOTE]\n> 참고"), /표준 Markdown/);
  await transform(root, "배열 [0]을 선택합니다.");
});

test("allows unpublished source posts to link unfinished episodes", async t => {
  const root = fixture(t);
  writeFileSync(join(root, "posts/first.md"), "---\ndraft: true\n---\n");
  writeFileSync(join(root, "posts/hidden.md"), "---\ndraft: true\n---\n");
  await transform(root, "[작성 중](hidden.md)");
});
