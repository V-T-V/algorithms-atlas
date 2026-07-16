// 几何分桶哈希 · 实现
export interface GbHooks {
  onItem?: (v: number, bucket: number) => void;
  onConclude?: (counts: Map<number, number>) => void;
}
export function geometricBucket(
  values: readonly number[],
  hooks: GbHooks = {},
): Map<number, number> {
  const counts = new Map<number, number>();
  for (const v of values) {
    const av = Math.abs(v);
    const bucket = av === 0 ? -Infinity : Math.floor(Math.log2(av));
    const bk = bucket === -Infinity ? -1000 : bucket;
    counts.set(bk, (counts.get(bk) ?? 0) + 1);
    hooks.onItem?.(v, bk);
  }
  hooks.onConclude?.(counts);
  return counts;
}
