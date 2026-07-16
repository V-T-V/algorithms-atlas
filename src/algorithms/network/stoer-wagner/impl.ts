// =============================================================================
// Stoer-Wagner 全局最小割 · 纯算法实现
// 最大相邻序（MAO）收缩。零 DOM 依赖，可独立单测。
// 节点用 0..n-1 的整数下标表示。
// =============================================================================

export interface WeightedEdgeInput {
  from: number;
  to: number;
  weight: number;
}

/** 最小割结果。 */
export interface MinCutResult {
  /** 最小割权值。 */
  cutValue: number;
  /** 最小割一侧的节点下标集合。 */
  side: number[];
}

/** 事件钩子。 */
export interface StoerWagnerHooks {
  /** 第 phase 轮（1-based）开始，给出当前活跃节点列表。 */
  onPhase?: (phase: number, alive: number[]) => void;
  /** 本轮 MAO 中把 node 加入集合 A，当前累计权重 wSum。 */
  onAddToA?: (node: number, wSum: number) => void;
  /** 本轮结束：收缩 (s, t)，本轮 s-t 割 = phaseCut，当前全局最优 bestCut。 */
  onContract?: (s: number, t: number, phaseCut: number, bestCut: number) => void;
  /** 发现更小的割：cutValue 与对应一侧节点列表。 */
  onImprove?: (cutValue: number, side: number[]) => void;
  /** 算法结束。 */
  onDone?: (cutValue: number) => void;
}

/**
 * Stoer-Wagner 全局最小割。
 *
 * @param n 节点数（0..n-1）
 * @param edges 无向加权边 {from, to, weight}（自环忽略，平行边累加）
 * @param hooks 可选钩子
 * @returns 最小割结果 { cutValue, side }
 */
export function stoerWagner(
  n: number,
  edges: readonly WeightedEdgeInput[],
  hooks: StoerWagnerHooks = {},
): MinCutResult {
  if (n === 0) {
    hooks.onDone?.(0);
    return { cutValue: 0, side: [] };
  }
  if (n === 1) {
    hooks.onDone?.(0);
    return { cutValue: 0, side: [0] };
  }

  // 邻接矩阵（无向，带权）
  const g: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (const e of edges) {
    if (e.from === e.to) continue;
    if (e.from < 0 || e.from >= n || e.to < 0 || e.to >= n) continue;
    g[e.from]![e.to]! += e.weight;
    g[e.to]![e.from]! += e.weight;
  }

  // 每个当前「超节点」包含的原始节点下标集合
  const vertexSet: number[][] = Array.from({ length: n }, (_, i) => [i]);
  const alive = new Set<number>(Array.from({ length: n }, (_, i) => i));

  let bestCut = Infinity;
  let bestSide: number[] = [];

  const phaseCount = n - 1;
  for (let phase = 1; phase <= phaseCount; phase++) {
    const aliveList = [...alive];
    hooks.onPhase?.(phase, aliveList);

    const start = aliveList[0]!;
    const inA = new Set<number>([start]);
    const wToA = new Map<number, number>();
    for (const v of aliveList) {
      if (v !== start) wToA.set(v, g[start]![v]!);
    }

    let last = start;
    let secondLast = -1;
    let cutOfPhase = 0;

    while (inA.size < aliveList.length) {
      // 选 wToA 最大的未加入节点
      let picked = -1;
      let pickedW = -1;
      for (const [v, w] of wToA) {
        if (w > pickedW) {
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
      for (const v of wToA.keys()) {
        wToA.set(v, wToA.get(v)! + g[picked]![v]!);
      }
    }

    hooks.onContract?.(secondLast, last, cutOfPhase, bestCut);

    if (cutOfPhase < bestCut) {
      bestCut = cutOfPhase;
      bestSide = [...vertexSet[last]!];
      hooks.onImprove?.(bestCut, [...bestSide]);
    }

    // 把 last 合并进 secondLast
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
  }

  hooks.onDone?.(bestCut);
  return { cutValue: bestCut, side: bestSide };
}
