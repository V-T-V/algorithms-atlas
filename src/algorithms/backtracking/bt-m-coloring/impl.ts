export interface McHooks {
  onColor?: (v: number, c: number) => void;
  onResult?: (ok: boolean) => void;
}
export function graphColoring(
  n: number,
  edges: Array<[number, number]>,
  m: number,
  hooks: McHooks = {},
): boolean {
  const adj: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [a, b] of edges) {
    adj[a]![b] = true;
    adj[b]![a] = true;
  }
  const color = new Array(n).fill(0);
  const safe = (v: number, c: number): boolean => {
    for (let i = 0; i < v; i++) if (adj[v]![i] && color[i] === c) return false;
    return true;
  };
  const go = (v: number): boolean => {
    if (v === n) return true;
    for (let c = 1; c <= m; c++) {
      if (safe(v, c)) {
        color[v] = c;
        hooks.onColor?.(v, c);
        if (go(v + 1)) return true;
        color[v] = 0;
      }
    }
    return false;
  };
  const ok = go(0);
  hooks.onResult?.(ok);
  return ok;
}
