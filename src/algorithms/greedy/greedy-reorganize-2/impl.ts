// 重构字符串 · 实现
export interface ReorganizeHooks {
  onPlace?: (idx: number, ch: string) => void;
  onConclude?: (result: string) => void;
}
export interface ReorganizeResult {
  value: string;
  ok: boolean;
}
export function greedyReorganize2(s: string, hooks: ReorganizeHooks = {}): ReorganizeResult {
  const counts: Record<string, number> = {};
  for (const c of s) counts[c] = (counts[c] ?? 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const n = s.length;
  if (sorted[0]![1] > Math.floor((n + 1) / 2)) {
    hooks.onConclude?.('');
    return { value: '', ok: false };
  }
  const arr = new Array(n).fill('');
  let idx = 0;
  for (const [ch, cnt] of sorted) {
    for (let k = 0; k < cnt; k++) {
      if (idx >= n) idx = 1;
      arr[idx] = ch;
      hooks.onPlace?.(idx, ch);
      idx += 2;
    }
  }
  const value = arr.join('');
  hooks.onConclude?.(value);
  return { value, ok: true };
}
