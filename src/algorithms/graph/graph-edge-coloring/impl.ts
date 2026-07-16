// =============================================================================
// 边着色（贪心）· 纯算法实现
// =============================================================================

export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string }>;
}

export interface EdgeColoringHooks {
  onColor?: (idx: number, from: string, to: string, color: number) => void;
  onDone?: (colors: number[], numColors: number) => void;
}

export function edgeColoringGreedy(input: GraphInput, hooks: EdgeColoringHooks = {}): number[] {
  // 每个端点已用的颜色集
  const used = new Map<string, Set<number>>();
  for (const n of input.nodes) used.set(n, new Set());
  const colors = new Array<number>(input.edges.length).fill(-1);
  for (let i = 0; i < input.edges.length; i++) {
    const e = input.edges[i]!;
    const fu = used.get(e.from)!;
    const tu = used.get(e.to)!;
    let c = 0;
    while (fu.has(c) || tu.has(c)) c++;
    colors[i] = c;
    fu.add(c);
    tu.add(c);
    hooks.onColor?.(i, e.from, e.to, c);
  }
  let num = 0;
  for (const c of colors) if (c + 1 > num) num = c + 1;
  hooks.onDone?.(colors, num);
  return colors;
}
