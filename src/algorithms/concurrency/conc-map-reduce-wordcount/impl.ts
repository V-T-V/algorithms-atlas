// MapReduce 词频统计 · 实现

export interface MapResult {
  shardId: number;
  counts: Map<string, number>;
}

export interface MrHooks {
  onMapDone?: (r: MapResult) => void;
  onReduceDone?: (total: Map<string, number>) => void;
}

/** 单 mapper：统计一片文本中各词出现次数。 */
export function mapWordCount(shardId: number, text: string): MapResult {
  const counts = new Map<string, number>();
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return { shardId, counts };
}

/** reducer：合并所有 mapper 的局部计数。 */
export function reduceWordCount(results: MapResult[]): Map<string, number> {
  const total = new Map<string, number>();
  for (const r of results) {
    for (const [w, c] of r.counts) total.set(w, (total.get(w) ?? 0) + c);
  }
  return total;
}

export interface MrResult {
  perShard: MapResult[];
  total: Map<string, number>;
  uniqueWords: number;
}

/** MapReduce 词频：把文本切成 shards 个分片，map+reduce。 */
export function mapReduceWordCount(text: string, shards = 3, hooks: MrHooks = {}): MrResult {
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  const per = Math.ceil(words.length / shards);
  const perShard: MapResult[] = [];
  for (let s = 0; s < shards; s++) {
    const slice = words.slice(s * per, (s + 1) * per).join(' ');
    const r = mapWordCount(s, slice);
    perShard.push(r);
    hooks.onMapDone?.(r);
  }
  const total = reduceWordCount(perShard);
  hooks.onReduceDone?.(total);
  return { perShard, total, uniqueWords: total.size };
}
