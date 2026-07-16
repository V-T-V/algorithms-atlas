// BWT v3 · 实现（朴素）
export interface BwtResult {
  last: string;
  primary: number;
}
export interface BwtHooks {
  onRotations?: (rots: string[]) => void;
  onResult?: (r: BwtResult) => void;
}
export function bwtEncode(s: string, hooks: BwtHooks = {}): BwtResult {
  const n = s.length;
  const rots: string[] = [];
  for (let i = 0; i < n; i++) rots.push(s.slice(i) + s.slice(0, i));
  hooks.onRotations?.(rots);
  rots.sort();
  const last = rots.map((r) => r[n - 1]!).join('');
  const primary = rots.findIndex((r) => r === s);
  const result = { last, primary };
  hooks.onResult?.(result);
  return result;
}
export function bwtDecode(last: string, primary: number): string {
  const n = last.length;
  const L = last.split('');
  // rank[i]: 该位置前（含）有多少个相同字符
  const rank = new Array<number>(n);
  const seen = new Map<string, number>();
  for (let i = 0; i < n; i++) {
    const c = L[i]!;
    rank[i] = seen.get(c) ?? 0;
    seen.set(c, (seen.get(c) ?? 0) + 1);
  }
  // C[c]: 严格小于 c 的字符总数（即 c 在 F 列的起始行）
  const counts = new Map<string, number>();
  for (const c of L) counts.set(c, (counts.get(c) ?? 0) + 1);
  const C = new Map<string, number>();
  let acc = 0;
  for (const c of [...counts.keys()].sort()) {
    C.set(c, acc);
    acc += counts.get(c)!;
  }
  // LF 映射遍历，收集后反转
  let collected = '';
  let idx = primary;
  for (let k = 0; k < n; k++) {
    collected += L[idx]!;
    idx = (C.get(L[idx]!) ?? 0) + rank[idx]!;
  }
  return collected.split('').reverse().join('');
}
