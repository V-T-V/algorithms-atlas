// Tabulation Hashing · 实现
export interface TabHooks {
  onChar?: (pos: number, ch: number, partial: number) => void;
  onConclude?: (hash: number) => void;
}
export function tabulationHash(data: string, table?: number[][], hooks: TabHooks = {}): number {
  const L = 16; // max length supported
  const T = table ?? makeTable(256, L, 42);
  let h = 0;
  for (let p = 0; p < data.length && p < L; p++) {
    const c = data.charCodeAt(p);
    const partial = T[c]![p]!;
    h ^= partial;
    hooks.onChar?.(p, c, h >>> 0);
  }
  hooks.onConclude?.(h >>> 0);
  return h >>> 0;
}
function makeTable(rows: number, cols: number, seed: number): number[][] {
  let s = seed;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s;
  };
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => rng()));
}
