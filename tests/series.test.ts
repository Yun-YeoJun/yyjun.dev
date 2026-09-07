import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSeries } from "../src/utils/series.ts";

const now = new Date("2026-09-07T00:00:00Z").getTime();
const definitions = [
  { id: "basics", data: { title: "기초", description: "기초 연재" } },
];
const post = (id: string, order: number, extra = {}) => ({
  id,
  data: {
    title: id,
    pubDatetime: new Date("2026-01-01"),
    series: "basics",
    seriesOrder: order,
    ...extra,
  },
});

test("orders episodes numerically, independently of publication date", () => {
  const result = buildSeries(
    [post("ten", 10), post("two", 2), post("one", 1)],
    definitions,
    now
  );
  assert.deepEqual(
    result[0].posts.map(p => p.id),
    ["one", "two", "ten"]
  );
});
test("hides drafts, future posts, and empty series", () => {
  const result = buildSeries(
    [
      post("draft", 1, { draft: true }),
      post("future", 2, { pubDatetime: new Date("2099-01-01") }),
    ],
    definitions,
    now
  );
  assert.deepEqual(result, []);
});
test("keeps only public episodes for navigation and allows gaps", () => {
  const result = buildSeries(
    [post("one", 1), post("draft", 2, { draft: true }), post("three", 3)],
    definitions,
    now
  );
  assert.deepEqual(
    result[0].posts.map(p => p.id),
    ["one", "three"]
  );
});
test("rejects duplicate episode numbers including drafts", () => {
  assert.throws(
    () =>
      buildSeries(
        [post("one", 1), post("draft", 1, { draft: true })],
        definitions,
        now
      ),
    /중복/
  );
});
test("rejects missing series definitions", () => {
  assert.throws(() => buildSeries([post("one", 1)], [], now), /정의되지 않은/);
});
test("rejects incomplete series metadata and invalid episode numbers", () => {
  for (const extra of [
    { series: undefined },
    { seriesOrder: undefined },
    { seriesOrder: 0 },
    { seriesOrder: -1 },
    { seriesOrder: 1.5 },
  ]) {
    assert.throws(() => buildSeries([post("bad", 1, extra)], definitions, now));
  }
});
test("ordinary posts are not assigned to a series", () => {
  assert.deepEqual(
    buildSeries(
      [
        {
          id: "ordinary",
          data: { title: "일반 글", pubDatetime: new Date("2026-01-01") },
        },
      ],
      definitions,
      now
    ),
    []
  );
});
