// =============================================================================
// 有向最小生成树（Edmonds / 朱-刘算法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：对指定根 r，每点（除根）选最小入边；若不成环即解；若成环则收缩，
//       环外入边权减去环内入边权，递归求解，最后展开环（替换一条环内边）。
// =============================================================================

/** 有向图输入（带权边 + 指定根）。 */
export interface DirectedGraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  root: string;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface EdmondsHooks {
  /** 每点（除根）选中一条最小入边 edge。 */
  onSelectMinIn?: (node: string, edge: { from: string; to: string; weight: number }) => void;
  /** 检测到一个环 cycle（节点序列）。 */
  onCycle?: (cycle: string[]) => void;
  /** 环收缩为新超级节点 superNode。 */
  onContract?: (cycle: string[], superNode: string) => void;
  /** 算法完成：总权 totalWeight、选中的原始边。 */
  onDone?: (
    totalWeight: number,
    edges: Array<{ from: string; to: string; weight: number }>,
  ) => void;
}

export interface EdmondsResult {
  /** 是否存在以 root 为根的外向生成树。 */
  exists: boolean;
  /** 最小总权。不存在时为 Infinity。 */
  totalWeight: number;
  /** 选中的边（原始输入边）。 */
  edges: Array<{ from: string; to: string; weight: number }>;
}

/** 工作边：当前图中的 from/to/weight，并保留原始端点用于最终还原。 */
interface WorkEdge {
  from: string;
  to: string;
  weight: number;
  origFrom: string;
  origTo: string;
}

interface SubResult {
  ok: boolean;
  weight: number;
  /** 选中的工作边（当前层语义）。 */
  chosen: WorkEdge[];
}

let contractCounter = 0;
const cycleId = (i: number): string => `__C${i}__`;

/**
 * 朱-刘 / Edmonds 有向最小生成树。
 *
 * @param input 有向图 + 根
 * @param hooks 可选事件钩子
 * @returns 是否存在、总权、选边
 */
export function edmonds(input: DirectedGraphInput, hooks: EdmondsHooks = {}): EdmondsResult {
  contractCounter = 0;
  const origWeight = new Map<string, number>();
  for (const e of input.edges) origWeight.set(`${e.from}>${e.to}`, e.weight);

  const initialEdges: WorkEdge[] = input.edges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.weight,
    origFrom: e.from,
    origTo: e.to,
  }));

  const sub = solve([...input.nodes], initialEdges, input.root, hooks);

  if (!sub.ok) return { exists: false, totalWeight: Infinity, edges: [] };

  // 还原为原始输入边
  const edges: Array<{ from: string; to: string; weight: number }> = sub.chosen.map((e) => ({
    from: e.origFrom,
    to: e.origTo,
    weight: origWeight.get(`${e.origFrom}>${e.origTo}`) ?? e.weight,
  }));

  hooks.onDone?.(sub.weight, edges);
  return { exists: true, totalWeight: sub.weight, edges };
}

/** 递归求解：返回选中工作边与总权。 */
function solve(nodes: string[], edges: WorkEdge[], root: string, hooks: EdmondsHooks): SubResult {
  if (!nodes.includes(root)) return { ok: false, weight: 0, chosen: [] };

  // 1. 每点（除根）选最小入边
  const minIn = new Map<string, WorkEdge>();
  for (const e of edges) {
    if (e.to === root) continue;
    const cur = minIn.get(e.to);
    if (!cur || e.weight < cur.weight) minIn.set(e.to, e);
  }
  for (const n of nodes) {
    if (n === root) continue;
    if (!minIn.has(n)) return { ok: false, weight: 0, chosen: [] };
  }
  for (const [n, e] of minIn) {
    hooks.onSelectMinIn?.(n, { from: e.from, to: e.to, weight: e.weight });
  }

  // 2. 检测环
  const cycle = findCycle(nodes, minIn, root);
  if (cycle === null) {
    // 无环：minIn 即答案
    let w = 0;
    const chosen: WorkEdge[] = [];
    for (const e of minIn.values()) {
      w += e.weight;
      chosen.push(e);
    }
    return { ok: true, weight: w, chosen };
  }

  // 3. 收缩环
  hooks.onCycle?.(cycle);
  const superNode = cycleId(contractCounter++);
  hooks.onContract?.(cycle, superNode);

  const cycleSet = new Set(cycle);
  const newEdges: WorkEdge[] = [];
  for (const e of edges) {
    const fromIn = cycleSet.has(e.from);
    const toIn = cycleSet.has(e.to);
    if (fromIn && toIn) continue;
    if (toIn) {
      newEdges.push({
        from: e.from,
        to: superNode,
        weight: e.weight - (minIn.get(e.to)?.weight ?? 0),
        origFrom: e.origFrom,
        origTo: e.origTo,
      });
    } else if (fromIn) {
      newEdges.push({
        from: superNode,
        to: e.to,
        weight: e.weight,
        origFrom: e.origFrom,
        origTo: e.origTo,
      });
    } else {
      newEdges.push({ ...e });
    }
  }
  const newNodes = [...nodes.filter((n) => !cycleSet.has(n)), superNode];

  const sub = solve(newNodes, newEdges, root, hooks);
  if (!sub.ok) return sub;

  // 4. 展开环
  // 递归选中的边中，恰有一条「进入 superNode」的边（其 origTo 指向环内某点 c*）
  // 该边替换环内 c* 的默认入边；环内其余各点保留其 minIn。
  const winningIntoCycle = sub.chosen.find((e) => e.to === superNode);
  const replaceTarget = winningIntoCycle ? winningIntoCycle.origTo : null;

  const expandedChosen: WorkEdge[] = [];
  for (const e of sub.chosen) {
    if (e.to === superNode) {
      expandedChosen.push(e); // 这就是进入环的边
    } else {
      expandedChosen.push(e);
    }
  }
  // 加入环内除 replaceTarget 外各点的 minIn（原始语义）
  for (const c of cycle) {
    if (c === replaceTarget) continue;
    const e = minIn.get(c)!;
    expandedChosen.push(e);
  }

  // 总权：递归权 + 环内默认入边权之和（进入环的边已在递归权中体现，其补偿已被减回）
  const cycleDefaultWeight = cycle
    .filter((c) => c !== replaceTarget)
    .reduce((s, c) => s + (minIn.get(c)?.weight ?? 0), 0);
  const totalWeight = sub.weight + cycleDefaultWeight;

  return { ok: true, weight: totalWeight, chosen: expandedChosen };
}

/** 在「每点一条入边」的图上找环（排除根）。无环返回 null。 */
function findCycle(
  nodes: string[],
  minIn: Map<string, { from: string; to: string; weight: number }>,
  root: string,
): string[] | null {
  const color = new Map<string, number>(); // 0 未访问, 1 在栈, 2 完成
  for (const n of nodes) color.set(n, 0);

  for (const start of nodes) {
    if (start === root || color.get(start) !== 0) continue;
    const path: string[] = [];
    let cur: string | null = start;
    while (cur !== null && cur !== root && color.get(cur) === 0) {
      color.set(cur, 1);
      path.push(cur);
      cur = minIn.get(cur)?.from ?? null;
    }
    if (cur !== null && cur !== root && color.get(cur) === 1) {
      const idx = path.indexOf(cur);
      return path.slice(idx);
    }
    for (const n of path) color.set(n, 2);
  }
  return null;
}
