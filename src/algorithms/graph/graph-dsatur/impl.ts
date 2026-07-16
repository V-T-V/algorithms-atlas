// =============================================================================
// DSATUR 着色 · 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface DsaturHooks {
  onPick?: (node: string, saturation: number) => void;
  onColor?: (node: string, color: number) => void;
  onDone?: (colors: Map<string, number>, numColors: number) => void;
}

export function dsatur(input: GraphInput, hooks: DsaturHooks = {}): Map<string, number> {
  const adj = new Map<string, Set<string>>();
  const deg = new Map<string, number>();
  for (const n of input.nodes) {
    adj.set(n, new Set());
    deg.set(n, 0);
  }
  for (const e of input.edges) {
    adj.get(e.from)?.add(e.to);
    adj.get(e.to)?.add(e.from);
    deg.set(e.from, (deg.get(e.from) ?? 0) + 1);
    deg.set(e.to, (deg.get(e.to) ?? 0) + 1);
  }
  const color = new Map<string, number>();
  const neighborColors = new Map<string, Set<number>>();
  for (const n of input.nodes) neighborColors.set(n, new Set());

  while (color.size < input.nodes.length) {
    // 选未着色节点中饱和度最大、并列度最大
    let pick: string | null = null;
    let bestSat = -1;
    let bestDeg = -1;
    for (const v of input.nodes) {
      if (color.has(v)) continue;
      const sat = neighborColors.get(v)!.size;
      const d = deg.get(v)!;
      if (sat > bestSat || (sat === bestSat && d > bestDeg)) {
        bestSat = sat;
        bestDeg = d;
        pick = v;
      }
    }
    if (pick === null) break;
    hooks.onPick?.(pick, bestSat);
    const used = neighborColors.get(pick)!;
    let c = 0;
    while (used.has(c)) c++;
    color.set(pick, c);
    hooks.onColor?.(pick, c);
    // 更新邻居饱和度
    for (const nb of adj.get(pick) ?? []) neighborColors.get(nb)!.add(c);
  }
  let numColors = 0;
  for (const c of color.values()) if (c + 1 > numColors) numColors = c + 1;
  hooks.onDone?.(color, numColors);
  return color;
}
