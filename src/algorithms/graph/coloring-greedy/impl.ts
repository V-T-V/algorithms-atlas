// =============================================================================
// 贪心图着色（Greedy Coloring, Welsh-Powell）· 纯算法实现
// 按度数降序处理顶点，每个顶点选最小可用颜色（未被其邻居占用）。
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface ColoringHooks {
  onOrder?: (order: string[]) => void;
  onColor?: (v: string, color: number) => void;
  onResult?: (colors: Map<string, number>, used: number) => void;
}

export interface ColoringResult {
  colors: Map<string, number>;
  used: number;
}

export function coloringGreedy(input: GraphInput, hooks: ColoringHooks = {}): ColoringResult {
  const { nodes, edges } = input;
  const adj = new Map<string, Set<string>>();
  for (const n of nodes) adj.set(n, new Set());
  for (const e of edges) {
    if (!adj.has(e.from) || !adj.has(e.to)) continue;
    adj.get(e.from)!.add(e.to);
    adj.get(e.to)!.add(e.from);
  }

  // 按度数降序（Welsh-Powell）
  const order = [...nodes].sort(
    (a, b) => adj.get(b)!.size - adj.get(a)!.size || a.localeCompare(b),
  );
  hooks.onOrder?.(order);

  const colors = new Map<string, number>();
  let used = 0;

  for (const v of order) {
    const neighborColors = new Set<number>();
    for (const nb of adj.get(v) ?? []) {
      const c = colors.get(nb);
      if (c !== undefined) neighborColors.add(c);
    }
    let c = 0;
    while (neighborColors.has(c)) c++;
    colors.set(v, c);
    if (c + 1 > used) used = c + 1;
    hooks.onColor?.(v, c);
  }

  hooks.onResult?.(colors, used);
  return { colors, used };
}
