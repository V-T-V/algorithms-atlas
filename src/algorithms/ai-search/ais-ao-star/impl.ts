export interface AoHooks {
  onExpand?: (node: number) => void;
  onCost?: (node: number, cost: number) => void;
}
export interface AoNode {
  id: number;
  isGoal: boolean;
  connectors: Array<{ children: number[]; cost: number }>;
}
export interface AoProblem {
  nodes: Map<number, AoNode>;
  root: number;
  h: (n: number) => number;
}
export function aoStarSearch(
  p: AoProblem,
  hooks: AoHooks = {},
): { cost: number; best: Map<number, number[]> } {
  const g = new Map<number, number>(); // 当前最优解代价
  const best = new Map<number, number[]>(); // 每节点最优 connector children
  for (const id of p.nodes.keys()) g.set(id, p.h(id));
  const marked = new Set<number>();
  const revise = (n: number) => {
    const node = p.nodes.get(n)!;
    let bestCost = node.isGoal ? 0 : Infinity;
    let bestKids: number[] = [];
    for (const c of node.connectors) {
      const cost = c.cost + c.children.reduce((s, k) => s + (g.get(k) ?? p.h(k)), 0);
      if (cost < bestCost) {
        bestCost = cost;
        bestKids = c.children;
      }
    }
    g.set(n, bestCost);
    best.set(n, bestKids);
    hooks.onCost?.(n, bestCost);
  };
  // 初始化所有节点并迭代到不动点（避免依赖 map 顺序）
  let changed = true;
  for (let iter = 0; changed && iter < 100; iter++) {
    changed = false;
    for (const id of p.nodes.keys()) {
      const before = g.get(id);
      revise(id);
      if (g.get(id) !== before) changed = true;
    }
  }
  // 自顶向下标记当前最优子图
  const mark = (n: number) => {
    if (marked.has(n)) return;
    marked.add(n);
    const node = p.nodes.get(n)!;
    hooks.onExpand?.(n);
    if (node.isGoal) return;
    for (const c of best.get(n) ?? []) mark(c);
  };
  mark(p.root);
  return { cost: g.get(p.root) ?? Infinity, best };
}
