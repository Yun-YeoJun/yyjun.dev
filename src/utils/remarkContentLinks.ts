import { existsSync, readFileSync } from "node:fs";
import { resolve, relative, dirname, sep } from "node:path";
import matter from "gray-matter";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import { postIdFromFile } from "./contentRoutes.ts";

interface Options {
  contentRoot?: string;
  base?: string;
}

export default function remarkContentLinks(options: Options = {}) {
  const root = resolve(options.contentRoot ?? "src/content");
  const base = (options.base ?? "/").replace(/\/+$/, "");
  return (tree: Root, file: VFile) => {
    // Unpublished source posts may contain links to other unfinished episodes.
    // Publishing them causes a fresh content render and normal validation.
    if (file.path && existsSync(file.path)) {
      const { data } = matter(readFileSync(file.path, "utf8"));
      if (
        data.draft ||
        (data.pubDatetime && new Date(data.pubDatetime).getTime() > Date.now())
      )
        return;
    }
    visit(tree, node => {
      if (
        node.type === "text" &&
        (/!?\[\[[^\]]+\]\]/.test(node.value) ||
          /^\[![A-Z]+\]/i.test(node.value))
      ) {
        file.fail(
          "표준 Markdown 링크/이미지/인용문을 사용하세요. 옵시디언 전용 문법은 지원하지 않습니다.",
          node
        );
      }
      if (node.type !== "link" && node.type !== "definition") return;
      const url = node.url;
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return;
      const match = url.match(/^([^?#]+\.md)([?#].*)?$/i);
      if (!match || !file.path) return;
      const target = resolve(dirname(file.path), decodeURIComponent(match[1]));
      const local = relative(root, target);
      if (local === ".." || local.startsWith(`..${sep}`))
        file.fail(`보관함 밖의 Markdown 링크입니다: ${url}`, node);
      if (!existsSync(target))
        file.fail(`링크 대상을 찾을 수 없습니다: ${url}`, node);
      const segments = local.split(sep);
      const section = segments.shift();
      if (
        segments.at(-1)?.startsWith("_") ||
        !["posts", "series", "pages"].includes(section ?? "")
      ) {
        file.fail(`공개되지 않은 Markdown 파일입니다: ${url}`, node);
      }
      const { data } = matter(readFileSync(target, "utf8"));
      if (
        data.draft ||
        (data.pubDatetime && new Date(data.pubDatetime).getTime() > Date.now())
      ) {
        file.fail(`공개되지 않은 글로 연결할 수 없습니다: ${url}`, node);
      }
      const id = postIdFromFile(segments.join("/"));
      if (section === "pages" && id !== "about")
        file.fail(`페이지 경로가 정의되지 않았습니다: ${url}`, node);
      const route = section === "pages" ? id : `${section}/${id}`;
      node.url = `${base}/${route}/${match[2] ?? ""}`;
    });
  };
}
