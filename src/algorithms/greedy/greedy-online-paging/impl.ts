// 在线页面置换 LRU · 实现
export interface PgHooks {
  onHit?: (page: number) => void;
  onMiss?: (page: number, evicted?: number) => void;
  onConclude?: (hits: number, misses: number) => void;
}
export function onlinePagingLru(
  requests: readonly number[],
  cacheSize: number,
  hooks: PgHooks = {},
): { hits: number; misses: number } {
  const cache: number[] = [];
  let hits = 0,
    misses = 0;
  for (const p of requests) {
    const idx = cache.indexOf(p);
    if (idx >= 0) {
      hits++;
      cache.splice(idx, 1);
      cache.push(p);
      hooks.onHit?.(p);
    } else {
      misses++;
      let evicted: number | undefined;
      if (cache.length >= cacheSize) evicted = cache.shift();
      cache.push(p);
      hooks.onMiss?.(p, evicted);
    }
  }
  hooks.onConclude?.(hits, misses);
  return { hits, misses };
}
