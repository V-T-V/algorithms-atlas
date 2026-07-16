// Sattolo 算法（随机环排列）· 纯算法实现
export interface SattoloHooks {
  onSwap?: (i: number, j: number, arr: number[]) => void;
  onResult?: (arr: number[]) => void;
}

/** 简单确定性 LCG。 */
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return s;
  };
}

export function sattoloCycle(
  n: number,
  rng: () => number = lcg(42),
  hooks: SattoloHooks = {},
): number[] {
  if (n <= 0) return [];
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = rng() % i; // [0, i) 关键差异
    [a[i], a[j]] = [a[j]!, a[i]!];
    hooks.onSwap?.(i, j, [...a]);
  }
  hooks.onResult?.([...a]);
  return a;
}

/** 验证 arr 是否构成单个循环。 */
export function isSingleCycle(arr: readonly number[]): boolean {
  if (arr.length === 0) return true;
  const n = arr.length;
  let cur = 0;
  const seen = new Set<number>();
  for (let k = 0; k < n; k++) {
    if (seen.has(cur)) return false;
    seen.add(cur);
    cur = arr[cur]!;
  }
  return cur === 0 && seen.size === n;
}
