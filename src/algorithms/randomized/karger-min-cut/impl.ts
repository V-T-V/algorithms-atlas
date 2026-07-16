// =============================================================================
// Karger 随机化最小割（Karger Randomized Min-Cut）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每次收缩，供录制器使用。
// =============================================================================

/** 无向边（顶点为 0..n-1 的整数）。 */
export type Edge = [number, number];

/** [0,1) 随机源。 */
export type Rng = () => number;

/** 算法执行过程中的事件钩子（针对某一次试验）。任一可选。 */
export interface KargerHooks {
  /** 一次试验开始。 */
  onTrialStart?: (trial: number) => void;
  /** 收缩边 (u,v) 为新超顶点 superV，剩余顶点数 remaining。 */
  onContract?: (u: number, v: number, superV: number, remaining: number) => void;
  /** 一次试验结束，得割大小 cut。 */
  onTrialEnd?: (trial: number, cut: number) => void;
  /** 全局最小割更新。 */
  onBestUpdate?: (cut: number) => void;
}

/** 线性同余 [0,1) 随机源，可复现。 */
export function makeLcg(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/** 并查集（带路径压缩 + 按秩合并）。 */
class DSU {
  parent: number[];
  rank: number[];
  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array<number>(n).fill(0);
  }
  find(x: number): number {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]!]!; // 路径压缩
      x = this.parent[x]!;
    }
    return x;
  }
  union(a: number, b: number): number {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return ra;
    if (this.rank[ra]! < this.rank[rb]!) {
      this.parent[ra] = rb;
      return rb;
    }
    if (this.rank[ra]! > this.rank[rb]!) {
      this.parent[rb] = ra;
      return ra;
    }
    this.parent[rb] = ra;
    this.rank[ra]!++;
    return ra;
  }
}

/**
 * 单次 Karger 收缩试验：随机收缩直到剩 2 个超顶点，返回割边数。
 *
 * @param n 顶点数
 * @param edges 边列表（无向，可重边）
 * @param rng 随机源
 * @param hooks 可选事件钩子
 * @returns 本次试验的割大小
 */
function singleTrial(n: number, edges: Edge[], rng: Rng, hooks: KargerHooks = {}): number {
  const dsu = new DSU(n);
  // 工作边表（深拷贝，避免污染）
  const work: Edge[] = edges.map((e) => [e[0], e[1]]);
  let components = n;

  while (components > 2) {
    // 过滤掉已合并（自环）边后随机选一条
    // 为效率，随机抽样：选到自环就跳过
    let u: number;
    let v: number;
    let idx: number;
    let attempts = 0;
    do {
      idx = Math.floor(rng() * work.length);
      u = work[idx]![0];
      v = work[idx]![1];
      attempts++;
      // 防止极端情况下死循环
      if (attempts > work.length * 4 + 10) break;
    } while (dsu.find(u) === dsu.find(v));

    if (dsu.find(u) === dsu.find(v)) {
      // 极少出现：剩余边全是自环，提前结束
      break;
    }

    const superV = dsu.union(u, v);
    components--;
    hooks.onContract?.(u, v, superV, components);
  }

  // 统计跨两个超顶点的边数（割）
  let cut = 0;
  const roots = new Set<number>();
  for (let i = 0; i < n; i++) roots.add(dsu.find(i));
  // 仅当恰剩 2 个超顶点时统计割；否则图可能不连通，割未定义，返回一个大数
  if (roots.size !== 2) return Number.MAX_SAFE_INTEGER;
  for (const [a, b] of work) {
    if (dsu.find(a) !== dsu.find(b)) cut++;
  }
  return cut;
}

/**
 * Karger 随机化全局最小割：重复多次试验取最小。
 *
 * @param n 顶点数
 * @param edges 边列表（无向，可重边）
 * @param trials 试验次数（默认 n²，至少 1）
 * @param seed 随机种子（可复现）
 * @param hooks 可选事件钩子
 * @returns 估计的最小割大小
 */
export function kargerMinCut(
  n: number,
  edges: Edge[],
  trials: number = Math.max(1, n * n),
  seed: number = 42,
  hooks: KargerHooks = {},
): number {
  if (n < 2) throw new Error(`顶点数必须 >= 2 / n must be >= 2, got ${n}`);
  if (edges.length === 0) throw new Error('边列表为空 / empty edge list');

  const rng = makeLcg(seed);
  let best = Number.MAX_SAFE_INTEGER;

  for (let t = 0; t < trials; t++) {
    hooks.onTrialStart?.(t);
    const cut = singleTrial(n, edges, rng, hooks);
    hooks.onTrialEnd?.(t, cut);
    if (cut < best) {
      best = cut;
      hooks.onBestUpdate?.(best);
    }
  }
  return best;
}
