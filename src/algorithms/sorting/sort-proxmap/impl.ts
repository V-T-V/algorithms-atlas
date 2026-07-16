// 近邻映射排序 · 纯算法实现
export interface ProxmapHooks {
  onHit?: (idx: number, value: number, arr: number[]) => void;
}

export function proxmapSort(arr: readonly number[], hooks: ProxmapHooks = {}): number[] {
  if (arr.length <= 1) return [...arr];
  const n = arr.length;
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const range = mx - mn + 1;
  const buckets: number[][] = Array.from({ length: n }, () => []);
  for (const v of arr) {
    const idx = Math.min(n - 1, Math.floor(((v - mn) / range) * n));
    const b = buckets[idx]!;
    let p = b.length;
    while (p > 0 && b[p - 1]! > v) {
      b[p] = b[p - 1]!;
      p--;
    }
    b[p] = v;
    hooks.onHit?.(idx, v, b);
  }
  const out: number[] = [];
  for (const b of buckets) out.push(...b);
  return out;
}
