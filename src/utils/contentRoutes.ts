import { slugifyStr } from "./slugify.ts";

/** The loader and Markdown links share this filename-based URL convention. */
export function postIdFromFile(entry: string): string {
  return entry
    .replace(/\\/g, "/")
    .replace(/\.md$/i, "")
    .split("/")
    .filter(part => !part.startsWith("_"))
    .map(slugifyStr)
    .join("/");
}
