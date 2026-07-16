// =============================================================================
// 随机化哈密顿路径判定 · 纯算法实现
// 随机排列 + 相邻断边交换 + 多次重启。Las Vegas 风格。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每步，供录制器使用。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface HamiltonianHooks {
  /** 第 restart 次重启：生成的初始排列。 */
  onRestart?: (restart: number, perm: number[]) => void;
  /** 局部修复：在位置 pos 处发现断边，尝试交换 pos 与 pos+1。 */
  onSwap?: (restart: number, step: number, pos: number, perm: number[]) => void;
  /** 检查某排列：当前断边数。 */
  onCheck?: (restart: number, brokenCount: number) => void;
  /** 最终结论（找到则给出路径，未找到则 null）。 */
  onResult?: (path: number[] | null, restarts: number) => void;
}

/** 确定性 RNG（Mulberry32）。 */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 用邻接矩阵表示无向图；adj[u][v]===true 表示有边。 */
export type Adjacency = boolean[][];

/** 从 RNG 构造邻接矩阵的工具（供测试）。 */
export function makeAdjacency(n: number, edges: Array<[number, number]>): Adjacency {
  const adj: Adjacency = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  for (const [u, v] of edges) {
    adj[u]![v] = true;
    adj[v]![u] = true;
  }
  return adj;
}

/** Fisher-Yates 洗牌（用给定 rng）。 */
function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

/** 统计排列中「断边」位置（即 adj[perm[i]][perm[i+1]]===false 的 i）。 */
function brokenEdges(perm: number[], adj: Adjacency): number[] {
  const broken: number[] = [];
  for (let i = 0; i + 1 < perm.length; i++) {
    if (!adj[perm[i]!]![perm[i + 1]!]) broken.push(i);
  }
  return broken;
}

/**
 * 随机化哈密顿路径搜索（Las Vegas）。
 *
 * @param n 顶点数
 * @param adj 邻接矩阵
 * @param restarts 重启次数（默认 50）
 * @param maxStepsPerRestart 每次重启的最大局部修复步数（默认 n²）
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns 找到的哈密顿路径（顶点序列）或 null
 */
export function randomizedHamiltonianPath(
  n: number,
  adj: Adjacency,
  restarts: number = 50,
  maxStepsPerRestart: number = n * n,
  rng: Rng = Math.random,
  hooks: HamiltonianHooks = {},
): number[] | null {
  if (n <= 1) {
    const p = n === 1 ? [0] : [];
    hooks.onResult?.(p.length ? p : null, 0);
    return p.length ? p : null;
  }

  for (let r = 0; r < restarts; r++) {
    const perm = shuffle(
      Array.from({ length: n }, (_, i) => i),
      rng,
    );
    hooks.onRestart?.(r, perm);

    for (let step = 0; step < maxStepsPerRestart; step++) {
      const broken = brokenEdges(perm, adj);
      hooks.onCheck?.(r, broken.length);

      if (broken.length === 0) {
        hooks.onResult?.(perm, r + 1);
        return perm; // 找到
      }

      // 选一个断边位置 pos，交换 perm[pos] 与 perm[pos+1]
      const pos = broken[Math.floor(rng() * broken.length)]!;
      const tmp = perm[pos]!;
      perm[pos] = perm[pos + 1]!;
      perm[pos + 1] = tmp;
      hooks.onSwap?.(r, step, pos, perm);
    }
  }
  hooks.onResult?.(null, restarts);
  return null;
}

/**
 * 确定性判定：用回溯判定是否存在哈密顿路径（用于小图对照）。
 * 返回路径或 null。时间 O(n!)。
 */
export function hamiltonianPathBacktrack(n: number, adj: Adjacency): number[] | null {
  if (n === 0) return null;
  const visited = new Array<boolean>(n).fill(false);
  const path: number[] = [];

  function dfs(u: number): boolean {
    visited[u] = true;
    path.push(u);
    if (path.length === n) return true;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && adj[u]![v]) {
        if (dfs(v)) return true;
      }
    }
    path.pop();
    visited[u] = false;
    return false;
  }

  for (let s = 0; s < n; s++) {
    if (dfs(s)) return path;
  }
  return null;
}
