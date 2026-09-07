import { existsSync, globSync, readFileSync, statSync } from "node:fs";
import { resolve, relative, sep } from "node:path";
import { parse, type DefaultTreeAdapterMap } from "parse5";

type Node = DefaultTreeAdapterMap["node"];

/** Check generated output, including links whose target was removed or hidden. */
export function validateBuildLinks(
  directory: string,
  base = "/",
  site = "https://blog.test"
): string[] {
  const root = resolve(directory);
  const prefix = base.replace(/\/+$/, "");
  const origin = new URL(site).origin;
  const pages = new Map<string, { ids: Set<string>; links: string[] }>();
  const errors: string[] = [];
  for (const file of globSync("**/*.html", { cwd: root })) {
    const ids = new Set<string>();
    const links: string[] = [];
    function walk(node: Node) {
      if ("attrs" in node) {
        for (const attr of node.attrs) {
          if (attr.name === "id") ids.add(attr.value);
          if (attr.name === "href" || attr.name === "src")
            links.push(attr.value);
        }
      }
      if ("childNodes" in node) node.childNodes.forEach(walk);
    }
    walk(parse(readFileSync(resolve(root, file), "utf8")));
    pages.set(resolve(root, file), { ids, links });
  }
  if (!pages.size) return ["검사할 빌드 HTML이 없습니다."];
  for (const [file, page] of pages) {
    const source = relative(root, file).split(sep).join("/");
    const pageUrl = `${origin}${prefix}/${source.replace(/index\.html$/, "")}`;
    for (const link of page.links) {
      if (!link || link === "#") continue;
      const url = new URL(link, pageUrl);
      if (url.origin !== origin) continue;
      const pathname = decodeURIComponent(url.pathname);
      if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) {
        errors.push(`${source}: 배포 경로 밖의 링크 ${link}`);
        continue;
      }
      let target = resolve(
        root,
        pathname.slice(prefix.length).replace(/^\/+/, "")
      );
      if (target !== root && !target.startsWith(root + sep)) {
        errors.push(`${source}: 출력 폴더 밖의 링크 ${link}`);
        continue;
      }
      if (existsSync(target) && statSync(target).isDirectory())
        target = resolve(target, "index.html");
      if (!existsSync(target)) {
        errors.push(`${source}: 링크/이미지 대상을 찾을 수 없습니다: ${link}`);
      } else if (
        url.hash &&
        pages.has(target) &&
        !pages.get(target)!.ids.has(decodeURIComponent(url.hash.slice(1)))
      ) {
        errors.push(`${source}: 대상 제목을 찾을 수 없습니다: ${link}`);
      }
    }
  }
  return errors;
}
