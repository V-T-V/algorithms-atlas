// =============================================================================
// 最小割（Min Cut / Global Min-Cut）· 纯算法实现
// Stoer-Wagner 算法：在无向加权图上通过 n-1 次「最大相邻序（MAO）收缩」求全局最小割。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步收缩供录制器使用。
// =============================================================================

/** 无向加权图输入。 */
export interface GraphInput {
  nodes: readonly string[];
  edges: ReadonlyArray<{ from: string; to: string; weight: number }>;
}

/** 最小割结果。 */
export interface MinCutResult {
  /** 最小割的权值之和。 */
  cutValue: number;
  /** 割划分后「最后被收缩」的一侧所含的原始节点 id（即 min-cut 的一侧）。 */
  side: string[];
  /** 另一侧的原始节点 id。 */
  otherSide: string[];
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MinCutHooks {
  /** 开始第 phase 轮收缩（1-based）。给出当前剩余的「超节点」集合（每个为原始 id 列表）。 */
  onPhase?: (phase: number, supernodes: string[][]) => void;
  /** 本轮 MAO 过程中加入一个节点到「已合并集」A 中。给出节点内部下标与当前累计权重。 */
  onAddToA?: (nodeIdx: number, wSum: number) => void;
  /** 本轮结束，收缩最后加入的两个节点 (s, t)，本轮「s-t 割」= wOfCut。 */
  onContract?: (s: number, t: number, wOfCut: number, bestCut: number) => void;
  /** 发现更小的割，更新全局最优。给出本轮割值与对应的「t 侧」原始节点列表。 */
  onImprove?: (cutValue: number, side: string[]) => void;
}

/**
 * Stoer-Wagner 全局最小割。
 *
 * 核心引理（最大相邻序，Maximum Adjacency Ordering）：
 *   任选起点，每次把「与已选集合 A 中所有边权和最大」的未选节点加入 A，
 *   最后加入的两个节点记为 s、t，则「s-t 最小割」要么等于本次 MAO 收缩的值 w(A→t)，
 *   要么 s 与 t 在同一侧（可把 s,t 合并而不影响全局最小割）。
 *
 * 流程：
 *   1. 重复 n-1 次：跑一次 MAO 得到 (s, t) 与本轮割 w；记录 min(w)。
 *   2. 把 s、t 合并（边权相加），节点数减一。
 *   3. 全局最小割 = 各轮 w 的最小值。
 *
 * 时间复杂度 `O(n^3)`（朴素邻接矩阵实现）；空间 `O(n^2)`。
 *
 * @param input 无向加权图（自环、平行边会被合并）
 * @param hooks 可选事件钩子
 */
export function minCut(input: GraphInput, hooks: MinCutHooks = {}): MinCutResult {
  const n = input.nodes.length;
  if (n === 0) return { cutValue: 0, side: [], otherSide: [] };
  if (n === 1) return { cutValue: 0, side: [...input.nodes], otherSide: [] };

  // 邻接矩阵（带权，无向）。g[i][j] = i-j 边权之和。
  const g: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (const e of input.edges) {
    const i = input.nodes.indexOf(e.from);
    const j = input.nodes.indexOf(e.to);
    if (i < 0 || j < 0 || i === j) continue;
    g[i]![j]! += e.weight;
    g[j]![i]! += e.weight;
  }

  // 每个当前「超节点」包含的原始节点下标集合。
  const vertexSet: number[][] = input.nodes.map((_, i) => [i]);
  // 当前活跃顶点下标（在收缩过程中会失效）。
  const alive = new Set<number>(input.nodes.map((_, i) => i));

  let bestCut = Infinity;
  let bestSide: number[] = [];

  const phaseCount = n - 1;
  for (let phase = 1; phase <= phaseCount; phase++) {
    const aliveList = [...alive];
    // MAO：起点取 aliveList[0]
    const inA = new Set<number>([aliveList[0]!]);
    // wToA[v] = v 到 A 中所有节点的边权和
    const wToA = new Map<number, number>();
    for (const v of aliveList) {
      if (v !== aliveList[0]) wToA.set(v, g[aliveList[0]!]![v]!);
    }

    let last: number = aliveList[0]!;
    let secondLast: number = -1;
    let cutOfPhase = 0;

    while (inA.size < aliveList.length) {
      // 选 wToA 最大的未加入节点
      let picked = -1;
      let pickedW = -1;
      for (const [v, w] of wToA) {
        if (!inA.has(v) && w > pickedW) {
          pickedW = w;
          picked = v;
        }
      }
      hooks.onAddToA?.(picked, pickedW);
      secondLast = last;
      last = picked;
      cutOfPhase = pickedW; // 最后加入节点的 wToA 即本轮 s-t 割
      inA.add(picked);
      wToA.delete(picked);
      // 更新其余节点到 A 的权重（加入 picked 的贡献）
      for (const v of wToA.keys()) {
        wToA.set(v, wToA.get(v)! + g[picked]![v]!);
      }
    }

    hooks.onContract?.(secondLast, last, cutOfPhase, bestCut);

    // 更新全局最优
    if (cutOfPhase < bestCut) {
      bestCut = cutOfPhase;
      bestSide = [...vertexSet[last]!];
      hooks.onImprove?.(
        bestCut,
        bestSide.map((idx) => input.nodes[idx]!),
      );
    }

    // 收缩 secondLast 与 last：把 last 合并进 secondLast
    for (const v of alive) {
      if (v !== secondLast && v !== last) {
        g[secondLast]![v]! += g[last]![v]!;
        g[v]![secondLast]! += g[v]![last]!;
      }
    }
    g[secondLast]![last]! = 0;
    g[last]![secondLast]! = 0;
    vertexSet[secondLast] = vertexSet[secondLast]!.concat(vertexSet[last]!);
    alive.delete(last);

    if (phase < phaseCount) {
      hooks.onPhase?.(
        phase + 1,
        [...alive].map((v) => vertexSet[v]!.map((idx) => input.nodes[idx]!)),
      );
    }
  }

  const sideIds = bestSide.map((idx) => input.nodes[idx]!);
  const sideSet = new Set(sideIds);
  const otherSideIds = input.nodes.filter((id) => !sideSet.has(id));
  return { cutValue: bestCut, side: sideIds, otherSide: otherSideIds };
}
