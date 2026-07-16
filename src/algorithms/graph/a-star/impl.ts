// =============================================================================
// A* 寻路 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// A* = Dijkstra + 启发函数：用 f = g + h 引导搜索向目标靠拢。
// =============================================================================

/** 加权图输入（与 dijkstra/bfs 保持一致）。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}

/** 启发函数：估计从任意节点到目标的最短距离。 */
export type Heuristic = (node: string, target: string) => number;

/** A* 执行过程中的事件钩子。任一可选。 */
export interface AStarHooks {
  /** 算法开始，初始化距离（除起点 0 外均为 ∞）。 */
  onInit?: (source: string, target: string) => void;
  /** 从 open 集取出 f 最小的节点展开。 */
  onPop?: (node: string, g: number, f: number) => void;
  /** 松弛边 from→to：候选 g 值 newG；improved 表示是否更优。 */
  onRelax?: (from: string, to: string, newG: number, f: number, improved: boolean) => void;
  /** 找到目标，确认最短路径。 */
  onDone?: (target: string, dist: number) => void;
}

/** 一条最短路径结果。 */
export interface ShortestPath {
  /** 到各节点的最短距离（g 值）；不可达为 Infinity。 */
  dist: Map<string, number>;
  /** 前驱节点（用于回溯路径）。 */
  prev: Map<string, string | null>;
  /** 是否成功到达 target。 */
  found: boolean;
}

/** 从 open 集中选 f 最小者（线性扫描，确定顺序）。 */
function pickMinF(
  open: Set<string>,
  gScore: Map<string, number>,
  h: (n: string) => number,
): string | null {
  let best: string | null = null;
  let bestF = Infinity;
  for (const id of open) {
    const f = (gScore.get(id) ?? Infinity) + h(id);
    if (f < bestF) {
      bestF = f;
      best = id;
    }
  }
  return best;
}

/**
 * A* 单源单目标最短路径。
 *
 * @param input 加权图
 * @param source 起点
 * @param target 目标
 * @param heuristic 启发函数（须 admissible：不高估真实距离）；默认 0 退化为 Dijkstra
 * @param hooks 可选事件钩子
 * @returns 最短距离表 dist、前驱表 prev、是否到达
 */
export function aStar(
  input: GraphInput,
  source: string,
  target: string,
  heuristic: Heuristic = () => 0,
  hooks: AStarHooks = {},
): ShortestPath {
  const { nodes, edges, directed = false } = input;
  const gScore = new Map<string, number>();
  const prev = new Map<string, string | null>();
  const adjW = new Map<string, Array<{ to: string; w: number }>>();

  for (const n of nodes) {
    gScore.set(n, Infinity);
    prev.set(n, null);
    adjW.set(n, []);
  }
  if (!gScore.has(source)) return { dist: gScore, prev, found: false };
  gScore.set(source, 0);
  hooks.onInit?.(source, target);

  for (const e of edges) {
    adjW.get(e.from)?.push({ to: e.to, w: e.weight });
    if (!directed) adjW.get(e.to)?.push({ to: e.from, w: e.weight });
  }
  // 邻接表按目标 id 排序，保证遍历顺序确定
  for (const list of adjW.values()) list.sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));

  const closed = new Set<string>();
  const open = new Set<string>([source]);

  while (open.size > 0) {
    const u = pickMinF(open, gScore, (n) => heuristic(n, target));
    if (u === null) break;
    const gu = gScore.get(u) ?? Infinity;
    const fu = gu + heuristic(u, target);
    open.delete(u);
    closed.add(u);
    hooks.onPop?.(u, gu, fu);

    if (u === target) {
      hooks.onDone?.(target, gu);
      return { dist: gScore, prev, found: true };
    }

    for (const { to: v, w } of adjW.get(u) ?? []) {
      if (closed.has(v)) continue;
      const ng = gu + w;
      const improved = ng < (gScore.get(v) ?? Infinity);
      if (improved) {
        gScore.set(v, ng);
        prev.set(v, u);
        open.add(v);
      }
      hooks.onRelax?.(u, v, ng, ng + heuristic(v, target), improved);
    }
  }

  return { dist: gScore, prev, found: closed.has(target) };
}

/** 由 prev 表回溯 source→target 的路径节点序列；不可达或断链返回 null。 */
export function reconstructPath(
  prev: Map<string, string | null>,
  source: string,
  target: string,
): string[] | null {
  if (!prev.has(target)) return null;
  const path: string[] = [];
  let cur: string | null = target;
  let guard = 0;
  while (cur !== null && guard <= prev.size) {
    path.push(cur);
    cur = prev.get(cur) ?? null;
    guard++;
  }
  const head = path[path.length - 1];
  if (head !== source) return null;
  path.reverse();
  return path;
}
