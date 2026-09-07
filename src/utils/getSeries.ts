import { getCollection } from "astro:content";
import { buildSeries } from "./series";

export async function getSeries() {
  const [posts, definitions] = await Promise.all([
    getCollection("posts"),
    getCollection("series"),
  ]);
  return buildSeries(posts, definitions);
}
