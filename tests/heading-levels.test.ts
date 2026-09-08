import { test } from "node:test";
import assert from "node:assert/strict";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import remarkHeadingLevels from "../src/utils/remarkHeadingLevels.ts";

// Catch missing shifts, invalid h7 output, and headings metadata drifting from HTML.
test("reserves h1 for the page title and shifts body headings and TOC metadata", async () => {
  const processor = await createMarkdownProcessor({
    remarkPlugins: [remarkHeadingLevels],
  });
  const result = await processor.render(
    "# 시작\n\n## 둘\n\n### 셋\n\n#### 넷\n\n##### 다섯\n\n###### 여섯"
  );
  assert.deepEqual(
    result.metadata.headings.map(({ depth }) => depth),
    [2, 3, 4, 5, 6, 6]
  );
  assert.match(result.code, /<h2 id="시작">시작<\/h2>/);
  assert.match(result.code, /<h3 id="둘">둘<\/h3>/);
  assert.match(result.code, /<h4 id="셋">셋<\/h4>/);
  assert.match(result.code, /<h5 id="넷">넷<\/h5>/);
  assert.match(result.code, /<h6 id="다섯">다섯<\/h6>/);
  assert.match(result.code, /<h6 id="여섯">여섯<\/h6>/);
  assert.doesNotMatch(result.code, /<h[17]\b/);
});

test("shifts Setext and nested headings without turning code examples into headings", async () => {
  const processor = await createMarkdownProcessor({
    remarkPlugins: [remarkHeadingLevels],
    syntaxHighlight: false,
  });
  const result = await processor.render(
    "Setext\n======\n\n> ## 인용\n\n```md\n# 코드 예시\n```\n\n`## 인라인`"
  );
  assert.deepEqual(
    result.metadata.headings.map(({ depth }) => depth),
    [2, 3]
  );
  assert.match(result.code, /<h2 id="setext">Setext<\/h2>/);
  assert.match(result.code, /<h3 id="인용">인용<\/h3>/);
  assert.match(result.code, /# 코드 예시/);
  assert.match(result.code, /<code>## 인라인<\/code>/);
});
