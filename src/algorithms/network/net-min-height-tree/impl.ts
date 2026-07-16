export interface MhtHooks {
  onPeel?: (v: number) => void;
  onResult?: (roots: number[]) => void;
}
export function findMinHeightTrees(
  n: number,
  edges: Array<[number, number]>,
  hooks: MhtHooks = {},
): number[] {
  if (n === 1) {
    hooks.onResult?.([0]);
    return [0];
  }
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
  for (const [a, b] of edges) {
    adj[a]!.add(b);
    adj[b]!.add(a);
  }
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) if (adj[i]!.size === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const next: number[] = [];
    for (const leaf of leaves) {
      const nb = [...adj[leaf]!][0]!;
      hooks.onPeel?.(leaf);
      adj[nb]!.delete(leaf);
      if (adj[nb]!.size === 1) next.push(nb);
    }
    leaves = next;
  }
  hooks.onResult?.(leaves);
  return leaves;
}
