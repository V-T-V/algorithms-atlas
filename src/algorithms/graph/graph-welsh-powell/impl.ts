// =============================================================================
// Welsh-Powell 着色 · 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface ColoringHooks {
  onOrder?: (order: string[]) => void;
  onColor?: (node: string, color: number) => void;
  onDone?: (colors: Map<string, number>, numColors: number) => void;
}

export function welshPowell(input: GraphInput, hooks: ColoringHooks = {}): Map<string, number> {
  const deg = new Map<string, number>();
  for (const n of input.nodes) deg.set(n, 0);
  const adj = new Map<string, Set<string>>();
  for (const n of input.nodes) adj.set(n, new Set());
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
    deg.set(e.from, (deg.get(e.from) ?? 0) + 1);
    deg.set(e.to, (deg.get(e.to) ?? 0) + 1);
  }
  const order = [...input.nodes].sort((a, b) => deg.get(b)! - deg.get(a)! || (a < b ? -1 : 1));
  hooks.onOrder?.(order);
  const color = new Map<string, number>();
  for (const v of order) {
    const used = new Set<number>();
    for (const nb of adj.get(v) ?? []) {
      if (color.has(nb)) used.add(color.get(nb)!);
    }
    let c = 0;
    while (used.has(c)) c++;
    color.set(v, c);
    hooks.onColor?.(v, c);
  }
  let numColors = 0;
  for (const c of color.values()) if (c + 1 > numColors) numColors = c + 1;
  hooks.onDone?.(color, numColors);
  return color;
}
