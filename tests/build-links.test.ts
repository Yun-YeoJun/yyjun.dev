import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateBuildLinks } from "../scripts/validate-build-links.ts";

test("checks real output routes, assets and anchors with a deployment prefix", t => {
  const root = mkdtempSync(join(tmpdir(), "blog-output-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "posts/one"), { recursive: true });
  writeFileSync(join(root, "posts/one/index.html"), '<h2 id="내용">내용</h2>');
  writeFileSync(join(root, "image.svg"), "<svg />");
  writeFileSync(
    join(root, "index.html"),
    '<a href="/blog/posts/one/#내용">글</a><img src="/blog/image.svg"><a href="https://external.test/">외부</a>'
  );
  assert.deepEqual(validateBuildLinks(root, "/blog"), []);
  writeFileSync(
    join(root, "index.html"),
    '<a href="/blog/series/empty/">없는 시리즈</a><img src="/blog/missing.png"><a href="/blog/posts/one/#없는제목">없는 제목</a>'
  );
  const errors = validateBuildLinks(root, "/blog");
  assert.equal(errors.length, 3);
  assert.ok(errors.some(error => error.includes("/series/empty/")));
  assert.ok(errors.some(error => error.includes("missing.png")));
  assert.ok(errors.some(error => error.includes("없는제목")));
});
