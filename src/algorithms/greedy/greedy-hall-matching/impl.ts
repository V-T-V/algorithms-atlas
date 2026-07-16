// Hall 定理验证 · 实现
export interface HallHooks {
  onSubset?: (S: number[], neighbors: number, ok: boolean) => void;
  onConclude?: (satisfies: boolean) => void;
}
export function hallTheorem(adj: ReadonlyArray<readonly number[]>, hooks: HallHooks = {}): boolean {
  const n = adj.length;
  let ok = true;
  for (let mask = 1; mask < 1 << n; mask++) {
    const S: number[] = [];
    const N = new Set<number>();
    for (let b = 0; b < n; b++)
      if (mask & (1 << b)) {
        S.push(b);
        for (const r of adj[b]!) N.add(r);
      }
    const good = N.size >= S.length;
    hooks.onSubset?.(S, N.size, good);
    if (!good) ok = false;
  }
  hooks.onConclude?.(ok);
  return ok;
}
