// 快速选择（双轴三分区）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每一步。

/** 事件钩子。 */
export interface QuickSelectDualPivotHooks {
  /** 选定两个基准 p1Idx、p2Idx（值 p1 <= p2）。 */
  onPivots?: (p1Idx: number, p2Idx: number, p1: number, p2: number) => void;
  /** 分区 [lo, hi] 完成，给出三段边界 lt、gt（lt=左段末+1，gt=右段首-1）。 */
  onPartition?: (lo: number, hi: number, lt: number, gt: number) => void;
  /** 比较下标 i。 */
  onCompare?: (i: number) => void;
  /** 交换 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 决定递归某段（给出段类型）。 */
  onRecurse?: (segment: 'left' | 'middle' | 'right', size: number) => void;
  /** 基线段足够小，命中答案。 */
  onBase?: (size: number, value: number) => void;
}

/**
 * 双轴快速选择：找数组中第 k 小（0-based）。
 *
 * 分区采用 Yaroslavskiy 双轴方案：选 a[lo]、a[hi] 作基准（先保证 p1≤p2）。
 * 维护指针：i 从 lo+1 向右扫描，lt 指向左段末，gt 从 hi-1 向左收缩。
 * 最终 a[lo..lt-1] < p1，a[lt..gt] ∈ [p1,p2]，a[gt+1..hi] > p2。
 *
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名（0-based）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselectDualPivot(
  arr: readonly number[],
  k: number,
  hooks: QuickSelectDualPivotHooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const select = (lo: number, hi: number): number => {
    if (lo === hi) {
      hooks.onBase?.(1, a[lo]!);
      return a[lo]!;
    }
    // 选基准并保证 p1 <= p2
    if (a[lo]! > a[hi]!) {
      swap(lo, hi);
      hooks.onSwap?.(lo, hi);
    }
    const p1 = a[lo]!;
    const p2 = a[hi]!;
    hooks.onPivots?.(lo, hi, p1, p2);

    let lt = lo + 1; // 左段末的下一个
    let gt = hi - 1; // 右段首的前一个
    let i = lo + 1;
    while (i <= gt) {
      hooks.onCompare?.(i);
      if (a[i]! < p1) {
        swap(i, lt);
        hooks.onSwap?.(i, lt);
        lt++;
        i++;
      } else if (a[i]! > p2) {
        while (i < gt && a[gt]! > p2) {
          hooks.onCompare?.(gt);
          gt--;
        }
        swap(i, gt);
        hooks.onSwap?.(i, gt);
        gt--;
      } else {
        i++;
      }
    }
    // 把基准归位：a[lo] 与 a[lt-1] 换；a[hi] 与 a[gt+1] 换
    lt--;
    gt++;
    swap(lo, lt);
    hooks.onSwap?.(lo, lt);
    swap(hi, gt);
    hooks.onSwap?.(hi, gt);
    hooks.onPartition?.(lo, hi, lt, gt);

    // 三段：[lo, lt-1] < p1；[lt, gt] ∈ [p1,p2]；[gt+1, hi] > p2
    const leftLen = lt - lo; // [lo, lt-1]
    const midLen = gt - lt + 1; // [lt, gt]
    const relLeftEnd = lo + leftLen - 1; // 左段在全局的末下标
    const relMidEnd = relLeftEnd + midLen; // 中段末下标 = gt

    if (k <= relLeftEnd) {
      hooks.onRecurse?.('left', leftLen);
      return select(lo, lt - 1);
    }
    if (k <= relMidEnd) {
      // 答案在中段，中段任意元素都 ∈ [p1,p2]，但 k 可能命中基准或中段元素
      // 直接选中段做一次完整查找（中段内未必有序，仍需选）
      return select(lt, gt);
    }
    hooks.onRecurse?.('right', hi - gt);
    return select(gt + 1, hi);
  };

  return select(0, a.length - 1);
}
