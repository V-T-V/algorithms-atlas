// =============================================================================
// 图着色（贪心）
// =============================================================================

export interface BipGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface ColorHooks {
  onColor?: (u: string, color: number) => void;
  onDone?: (coloring: Map<string, number>, maxColor: number) => void;
}

export function greedyColor(
  input: BipGraphInput,
  hooks: ColorHooks = {},
): { coloring: Map<string, number>; maxColor: number } {
  const adj = new Map<string, string[]>();
  for (const n of input.nodes) adj.set(n, []);
  for (const e of input.edges) {
    adj.get(e.from)?.push(e.to);
    adj.get(e.to)?.push(e.from);
  }
  const coloring = new Map<string, number>();
  let maxColor = 0;
  for (const u of input.nodes) {
    const used = new Set<number>();
    for (const v of adj.get(u) ?? []) {
      const c = coloring.get(v);
      if (c !== undefined) used.add(c);
    }
    let c = 1;
    while (used.has(c)) c++;
    coloring.set(u, c);
    if (c > maxColor) maxColor = c;
    hooks.onColor?.(u, c);
  }
  hooks.onDone?.(coloring, maxColor);
  return { coloring, maxColor };
}
