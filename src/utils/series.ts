export interface SeriesPost {
  id: string;
  data: {
    title: string;
    pubDatetime: Date;
    draft?: boolean;
    series?: string;
    seriesOrder?: number;
  };
}

export interface SeriesDefinition {
  id: string;
  data: { title: string; description: string };
}

/** Validate every episode, then expose only public episodes in reading order. */
export function buildSeries<P extends SeriesPost, S extends SeriesDefinition>(
  posts: P[],
  definitions: S[],
  now = Date.now()
): { definition: S; posts: P[] }[] {
  const groups = new Map(
    definitions.map(definition => [
      definition.id,
      { definition, posts: [] as P[] },
    ])
  );
  const occupied = new Set<string>();
  for (const post of posts) {
    const { series, seriesOrder } = post.data;
    if (series === undefined && seriesOrder === undefined) continue;
    if (!series || !Number.isInteger(seriesOrder) || (seriesOrder ?? 0) < 1) {
      throw new Error(
        `${post.id}: series와 양의 정수 seriesOrder를 함께 지정하세요.`
      );
    }
    const group = groups.get(series);
    if (!group)
      throw new Error(`${post.id}: 정의되지 않은 시리즈 '${series}'입니다.`);
    const key = `${series}:${seriesOrder}`;
    if (occupied.has(key))
      throw new Error(
        `${post.id}: 시리즈 '${series}'의 ${seriesOrder}회차가 중복됩니다.`
      );
    occupied.add(key);
    if (!post.data.draft && post.data.pubDatetime.getTime() <= now)
      group.posts.push(post);
  }
  return [...groups.values()]
    .filter(group => group.posts.length > 0)
    .map(group => ({
      ...group,
      posts: group.posts.sort(
        (a, b) => a.data.seriesOrder! - b.data.seriesOrder!
      ),
    }))
    .sort((a, b) =>
      a.definition.data.title.localeCompare(b.definition.data.title, "ko")
    );
}
