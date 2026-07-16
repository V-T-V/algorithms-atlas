export interface AdHooks {
  onEdge?: (from: string, to: string) => void;
  onResult?: (order: string) => void;
}
export function alienOrder(words: string[], hooks: AdHooks = {}): string {
  const adj = new Map<string, Set<string>>();
  const indeg = new Map<string, number>();
  for (const w of words)
    for (const ch of w) {
      if (!adj.has(ch)) adj.set(ch, new Set());
      if (!indeg.has(ch)) indeg.set(ch, 0);
    }
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i]!,
      b = words[i + 1]!;
    let j = 0;
    const m = Math.min(a.length, b.length);
    while (j < m && a[j] === b[j]) j++;
    if (j < m) {
      const from = a[j]!,
        to = b[j]!;
      if (!adj.get(from)!.has(to)) {
        adj.get(from)!.add(to);
        indeg.set(to, indeg.get(to)! + 1);
        hooks.onEdge?.(from, to);
      }
    } else if (a.length > b.length) {
      hooks.onResult?.('');
      return '';
    }
  }
  const q: string[] = [];
  for (const [ch, d] of indeg) if (d === 0) q.push(ch);
  let order = '';
  while (q.length) {
    const u = q.shift()!;
    order += u;
    for (const v of adj.get(u) ?? []) {
      indeg.set(v, indeg.get(v)! - 1);
      if (indeg.get(v) === 0) q.push(v);
    }
  }
  const r = order.length === indeg.size ? order : '';
  hooks.onResult?.(r);
  return r;
}
