export interface RcHooks {
  onCheck?: (a: number, b: number, cycle: boolean) => void;
  onResult?: (edge: Array<number>) => void;
}
export function findRedundantConnection(
  edges: Array<[number, number]>,
  hooks: RcHooks = {},
): Array<number> {
  const parent = new Map<number, number>();
  const find = (x: number): number => {
    if (!parent.has(x)) parent.set(x, x);
    const p = parent.get(x)!;
    if (p === x) return x;
    parent.set(x, find(p));
    return parent.get(x)!;
  };
  const union = (a: number, b: number): boolean => {
    const ra = find(a),
      rb = find(b);
    if (ra === rb) return false;
    parent.set(ra, rb);
    return true;
  };
  for (const [a, b] of edges) {
    if (!union(a, b)) {
      hooks.onCheck?.(a, b, true);
      hooks.onResult?.([a, b]);
      return [a, b];
    }
    hooks.onCheck?.(a, b, false);
  }
  return [];
}
