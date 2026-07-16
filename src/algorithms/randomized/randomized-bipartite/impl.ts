// =============================================================================
// 随机化二分图最大匹配 · 纯算法实现
// 提供：(1) 随机顺序贪心匹配（1/2 近似，期望）；
//      (2) 随机化增广路径（逼近最大匹配，Las Vegas 风格）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 二分图：左侧顶点 0..L-1，右侧顶点 0..R-1。邻接表 adj[u] = u 连到的右点列表。 */
export interface BipartiteGraph {
  left: number;
  right: number;
  /** adj[u] 为 u 的右邻居列表（去重，升序不强制）。 */
  adj: number[][];
}

/** 一条匹配边：u（左）匹配到 v（右）。 */
export interface MatchEdge {
  u: number;
  v: number;
}

/** 匹配结果：边集 + 两侧的匹配映射。 */
export interface Matching {
  /** u → v（-1 表示未匹配）。 */
  matchL: Int32Array;
  /** v → u（-1 表示未匹配）。 */
  matchR: Int32Array;
  /** 匹配边列表。 */
  edges: MatchEdge[];
  /** 匹配大小。 */
  size: number;
}

/** 事件钩子（贪心）。 */
export interface GreedyHooks {
  /** 考察一条边 (u,v)，是否选入。 */
  onConsider?: (u: number, v: number, taken: boolean) => void;
  /** 一条边被选入。 */
  onTake?: (u: number, v: number) => void;
}

/** 事件钩子（增广）。 */
export interface AugmentHooks {
  /** 从左点 u 开始尝试增广，是否成功。 */
  onAugmentTry?: (u: number, success: boolean) => void;
  /** 增广成功，更新匹配。 */
  onAugment?: (path: number[]) => void;
  /** 完成一轮扫描。 */
  onRound?: (round: number, matched: number) => void;
}

/** 确定性 RNG（便于单测）。 */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/** Fisher–Yates 洗牌（in-place）。 */
export function shuffle<T>(arr: T[], rng: Rng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

/** 把匹配结果打包。 */
function packMatching(matchL: Int32Array, matchR: Int32Array): Matching {
  const edges: MatchEdge[] = [];
  for (let u = 0; u < matchL.length; u++) {
    const v = matchL[u]!;
    if (v >= 0) edges.push({ u, v });
  }
  return { matchL, matchR, edges, size: edges.length };
}

/**
 * 随机化贪心匹配（1/2 近似）。
 * 把所有边随机排序，两端均空闲则选入。
 */
export function greedyMatching(g: BipartiteGraph, rng: Rng, hooks: GreedyHooks = {}): Matching {
  const matchL = new Int32Array(g.left).fill(-1);
  const matchR = new Int32Array(g.right).fill(-1);

  // 收集所有边并随机排序
  const allEdges: Array<{ u: number; v: number }> = [];
  for (let u = 0; u < g.left; u++) {
    for (const v of g.adj[u]!) allEdges.push({ u, v });
  }
  shuffle(allEdges, rng);

  let size = 0;
  for (const { u, v } of allEdges) {
    if (matchL[u]! === -1 && matchR[v]! === -1) {
      matchL[u] = v;
      matchR[v] = u;
      size++;
      hooks.onConsider?.(u, v, true);
      hooks.onTake?.(u, v);
    } else {
      hooks.onConsider?.(u, v, false);
    }
  }

  void size;
  return packMatching(matchL, matchR);
}

/**
 * 从左点 u 出发找增广路径（随机化 DFS 探索邻居）。
 * 返回 true 表示找到并已翻转。
 */
function tryAugment(
  u: number,
  g: BipartiteGraph,
  matchL: Int32Array,
  matchR: Int32Array,
  visited: Uint8Array,
  rng: Rng,
): boolean {
  // 随机化邻居顺序
  const neigh = [...g.adj[u]!];
  shuffle(neigh, rng);
  for (const v of neigh) {
    if (visited[v]!) continue;
    visited[v] = 1;
    const w = matchR[v]!;
    if (w === -1) {
      // v 空闲，找到增广路径终点
      matchL[u] = v;
      matchR[v] = u;
      return true;
    }
    // 递归：尝试给 w 换个匹配
    if (tryAugment(w, g, matchL, matchR, visited, rng)) {
      matchL[u] = v;
      matchR[v] = u;
      return true;
    }
  }
  return false;
}

/**
 * 随机化增广路径求最大匹配（Las Vegas：结果总是某匹配，多次扫描逼近最大）。
 *
 * @param g 二分图
 * @param rng 随机源
 * @param rounds 扫描轮数（每轮对每个未匹配左点尝试增广）
 * @param hooks 钩子
 */
export function augmentMatching(
  g: BipartiteGraph,
  rng: Rng,
  rounds: number = 3,
  hooks: AugmentHooks = {},
): Matching {
  const matchL = new Int32Array(g.left).fill(-1);
  const matchR = new Int32Array(g.right).fill(-1);

  let changed = true;
  let round = 0;
  while (changed && round < rounds) {
    changed = false;
    // 随机化左点扫描顺序
    const order = Array.from({ length: g.left }, (_, i) => i);
    shuffle(order, rng);
    for (const u of order) {
      if (matchL[u]! !== -1) continue;
      const visited = new Uint8Array(g.right);
      const ok = tryAugment(u, g, matchL, matchR, visited, rng);
      hooks.onAugmentTry?.(u, ok);
      if (ok) changed = true;
    }
    let matched = 0;
    for (let u = 0; u < g.left; u++) if (matchL[u]! !== -1) matched++;
    hooks.onRound?.(round, matched);
    round++;
  }

  return packMatching(matchL, matchR);
}

/**
 * 构造路径数组（用于钩子展示）：从 u 出发的增广路径上的右点序列。
 * 仅在已知增广成功后用于记录，这里返回空（接口预留）。
 */
export function findAugmentPath(
  u: number,
  g: BipartiteGraph,
  matchR: Int32Array,
  rng: Rng,
): number[] | null {
  const visited = new Uint8Array(g.right);
  const path: number[] = [];
  function dfs(x: number): boolean {
    const neigh = [...g.adj[x]!];
    shuffle(neigh, rng);
    for (const v of neigh) {
      if (visited[v]!) continue;
      visited[v] = 1;
      path.push(v);
      const w = matchR[v]!;
      if (w === -1) return true;
      if (dfs(w)) return true;
      path.pop();
    }
    return false;
  }
  if (dfs(u)) return path;
  return null;
}

/** 构造示例二分图（4×4，含一个完美匹配）。 */
export function makeSampleGraph(): BipartiteGraph {
  // 左 0: [0,1]  左 1: [0,2]  左 2: [1,3]  左 3: [2,3]
  return {
    left: 4,
    right: 4,
    adj: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ],
  };
}

/** 计算精确最大匹配大小（暴力枚举所有匹配，用于测试基准）。 */
export function maxMatchingExact(g: BipartiteGraph): number {
  const matchR = new Int32Array(g.right).fill(-1);
  let best = 0;
  function dfs(u: number, matched: number): void {
    if (u === g.left) {
      if (matched > best) best = matched;
      return;
    }
    // 不匹配 u
    dfs(u + 1, matched);
    // 尝试匹配 u 到某个空闲右点
    for (const v of g.adj[u]!) {
      if (matchR[v]! === -1) {
        matchR[v] = u;
        dfs(u + 1, matched + 1);
        matchR[v] = -1;
      }
    }
  }
  dfs(0, 0);
  return best;
}
