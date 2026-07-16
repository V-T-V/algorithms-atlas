// =============================================================================
// 最小高度树 · 纯算法实现（剥叶法）
// =============================================================================

export interface MinHeightTreesHooks {
  onPeel?: (round: number, leaves: number[]) => void;
  onResult?: (roots: number[]) => void;
}

export function findMinHeightTrees(
  n: number,
  edges: ReadonlyArray<[number, number]>,
  hooks: MinHeightTreesHooks = {},
): number[] {
  if (n === 1) {
    hooks.onResult?.([0]);
    return [0];
  }
  const adj = new Map<number, Set<number>>();
  for (let i = 0; i < n; i++) adj.set(i, new Set());
  for (const [u, v] of edges) {
    adj.get(u)!.add(v);
    adj.get(v)!.add(u);
  }
  let leaves: number[] = [];
  for (let i = 0; i < n; i++) {
    if (adj.get(i)!.size === 1) leaves.push(i);
  }
  let round = 0;
  while (n > 2) {
    round++;
    hooks.onPeel?.(round, leaves);
    n -= leaves.length;
    const next: number[] = [];
    for (const leaf of leaves) {
      const neighbor = [...adj.get(leaf)!][0]!;
      adj.get(neighbor)!.delete(leaf);
      if (adj.get(neighbor)!.size === 1) next.push(neighbor);
    }
    leaves = next;
  }
  const result = leaves;
  hooks.onResult?.(result);
  return result;
}
