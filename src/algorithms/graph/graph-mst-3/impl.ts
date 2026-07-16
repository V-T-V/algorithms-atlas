// =============================================================================
// Borůvka MST
// =============================================================================

export interface MstGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

export interface BoruvkaHooks {
  onRound?: (round: number, components: number) => void;
  onMerge?: (a: string, b: string, w: number) => void;
  onDone?: (
    totalWeight: number,
    edges: Array<{ from: string; to: string; weight: number }>,
  ) => void;
}

export function boruvka(
  input: MstGraphInput,
  hooks: BoruvkaHooks = {},
): { totalWeight: number; edges: Array<{ from: string; to: string; weight: number }> } {
  const parent = new Map<string, string>();
  for (const n of input.nodes) parent.set(n, n);
  const find = (x: string): string => {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)!)!);
      x = parent.get(x)!;
    }
    return x;
  };
  const mstEdges: Array<{ from: string; to: string; weight: number }> = [];
  let total = 0;
  let round = 0;
  while (true) {
    const roots = new Set<string>();
    for (const n of input.nodes) roots.add(find(n));
    if (roots.size === 1) break;
    round++;
    hooks.onRound?.(round, roots.size);
    const cheapest = new Map<string, { from: string; to: string; weight: number }>();
    for (const e of input.edges) {
      const ru = find(e.from);
      const rv = find(e.to);
      if (ru === rv) continue;
      const cur1 = cheapest.get(ru);
      if (!cur1 || e.weight < cur1.weight)
        cheapest.set(ru, { from: e.from, to: e.to, weight: e.weight });
      const cur2 = cheapest.get(rv);
      if (!cur2 || e.weight < cur2.weight)
        cheapest.set(rv, { from: e.from, to: e.to, weight: e.weight });
    }
    let merged = false;
    for (const e of cheapest.values()) {
      const ru = find(e.from);
      const rv = find(e.to);
      if (ru !== rv) {
        parent.set(ru, rv);
        mstEdges.push({ from: e.from, to: e.to, weight: e.weight });
        total += e.weight;
        merged = true;
        hooks.onMerge?.(e.from, e.to, e.weight);
      }
    }
    if (!merged) break;
  }
  hooks.onDone?.(total, mstEdges);
  return { totalWeight: total, edges: mstEdges };
}
