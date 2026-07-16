// Sattolo 循环 · 实现

export type Rng = () => number;
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return (): number => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export interface SatHooks {
  onSwap?: (i: number, j: number, arr: number[]) => void;
}

/** Sattolo：把 0..n-1 洗成单个随机循环。 */
export function sattoloCycle(n: number, rng: Rng, hooks: SatHooks = {}): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * i); // [0, i)
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
    hooks.onSwap?.(i, j, [...a]);
  }
  return a;
}

/** 验证 a 是否构成单一循环。 */
export function isSingleCycle(a: number[]): boolean {
  const n = a.length;
  if (n === 0) return true;
  const visited = new Array(n).fill(false);
  let cur = 0;
  for (let k = 0; k < n; k++) {
    if (visited[cur]) return false;
    visited[cur] = true;
    cur = a[cur]!;
  }
  return cur === 0 && visited.every(Boolean);
}
