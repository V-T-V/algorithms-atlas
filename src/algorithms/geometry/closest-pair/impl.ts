// =============================================================================
// 最近点对 Closest Pair · 纯算法实现（分治 O(n log n)）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露划分/合并/更新最近对每一步。
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ClosestPairHooks {
  /** 进入某段子问题：x 区间 [lo, hi)（按排序后下标）。 */
  onDivide?: (lo: number, hi: number) => void;
  /** 考察一对点 i, j（暴力或合并带）。 */
  onCompare?: (i: number, j: number) => void;
  /** 更新当前最近对（i, j，新距离 dist）。 */
  onUpdate?: (i: number, j: number, dist: number) => void;
  /** 合并阶段：处理跨越中线的点带，带半宽 delta。 */
  onMerge?: (mid: number, delta: number) => void;
}

export interface ClosestPairResult {
  /** 最近对的两个点（按输入顺序，去重）。 */
  pair: [Point, Point];
  /** 最近对距离。 */
  distance: number;
}

/** 两点欧氏距离。 */
function dist(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 最近点对 —— 分治算法。
 *
 * 步骤：\n
 * 1. 按 x 排序，递归处理左半 / 右半，分别得到两侧最近对距离，取较小者 delta\n
 * 2. 合并：考虑跨越中线、且 |x - midX| < delta 的点，组成「带」\n
 * 3. 把带内点按 y 排序，对每个点只检查其后 7 个点（鸽巢原理保证）\n
 * 4. 若找到更近的对则更新 delta\n
 *
 * 时间 `O(n log n)`（排序主导，带内检查为摊还 `O(n)`），空间 `O(n)`。
 *
 * @param points 输入点集（不会被修改）
 * @param hooks 可选事件钩子
 * @returns 最近对与距离。点数 < 2 时返回距离 Infinity。
 */
export function closestPair(
  points: readonly Point[],
  hooks: ClosestPairHooks = {},
): ClosestPairResult {
  const n = points.length;
  if (n < 2) {
    return { pair: [points[0] ?? { x: 0, y: 0 }, points[0] ?? { x: 0, y: 0 }], distance: Infinity };
  }
  // 按 x（同 x 按 y）排序，记录原下标
  const idx = points
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.x !== b.p.x ? a.p.x - b.p.x : a.p.y - b.p.y));
  const sorted = idx.map((e) => e.p);
  const sortedIdx = idx.map((e) => e.i);

  let bestDist = Infinity;
  let bestPair: [number, number] = [sortedIdx[0]!, sortedIdx[1]!];

  const brute = (lo: number, hi: number): void => {
    for (let i = lo; i < hi; i++) {
      for (let j = i + 1; j < hi; j++) {
        hooks.onCompare?.(sortedIdx[i]!, sortedIdx[j]!);
        const d = dist(sorted[i]!, sorted[j]!);
        if (d < bestDist) {
          bestDist = d;
          bestPair = [sortedIdx[i]!, sortedIdx[j]!];
          hooks.onUpdate?.(sortedIdx[i]!, sortedIdx[j]!, d);
        }
      }
    }
  };

  const stripClosest = (lo: number, mid: number, hi: number, delta: number): void => {
    const midX = sorted[mid]!.x;
    // 收集带内点（保持按 y 排序）
    const strip: Array<{ p: Point; idx: number }> = [];
    for (let i = lo; i < hi; i++) {
      if (Math.abs(sorted[i]!.x - midX) < delta) {
        strip.push({ p: sorted[i]!, idx: sortedIdx[i]! });
      }
    }
    strip.sort((a, b) => a.p.y - b.p.y);
    for (let i = 0; i < strip.length; i++) {
      // 最多检查后续 7 个
      for (let j = i + 1; j < strip.length && strip[j]!.p.y - strip[i]!.p.y < delta; j++) {
        hooks.onCompare?.(strip[i]!.idx, strip[j]!.idx);
        const d = dist(strip[i]!.p, strip[j]!.p);
        if (d < bestDist) {
          bestDist = d;
          bestPair = [strip[i]!.idx, strip[j]!.idx];
          hooks.onUpdate?.(strip[i]!.idx, strip[j]!.idx, d);
        }
      }
    }
  };

  const rec = (lo: number, hi: number): void => {
    if (hi - lo <= 3) {
      brute(lo, hi);
      return;
    }
    hooks.onDivide?.(lo, hi);
    const mid = (lo + hi) >> 1;
    rec(lo, mid);
    rec(mid, hi);
    hooks.onMerge?.(mid, bestDist);
    stripClosest(lo, mid, hi, bestDist);
  };

  rec(0, n);

  const [a, b] = bestPair;
  return {
    pair: [points[a]!, points[b]!],
    distance: bestDist,
  };
}
