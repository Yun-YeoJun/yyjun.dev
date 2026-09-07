import type { CollectionEntry } from "astro:content";

/** Drafts and future posts are excluded consistently from all public output. */
export function postFilter({ data }: CollectionEntry<"posts">) {
  return !data.draft && new Date(data.pubDatetime).getTime() <= Date.now();
}
