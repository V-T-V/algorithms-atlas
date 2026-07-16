// =============================================================================
// 三分查找（Ternary Search）· 纯算法实现
// 在单峰（凸/凹）函数/数组上找极值。取两个内分点 m1、m2 比较决定去哪段。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TernarySearchHooks {
  /** 取两个内分点 m1、m2 并比较。 */
  onProbe?: (lo: number, hi: number, m1: number, m2: number) => void;
  /** 区间收缩：'left' 保留左段（去 [lo,m2]），'right' 保留右段（去 [m1,hi]）。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成，给出极值下标。 */
  onDone?: (extremumIndex: number) => void;
}

/**
 * 三分查找求凸数组的最大值下标（先增后减）。
 * @returns 最大值下标；空数组返回 -1。
 */
export function ternarySearch(arr: readonly number[], hooks: TernarySearchHooks = {}): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 2) {
    const m1 = lo + ((hi - lo) >> 2);
    const m2 = hi - ((hi - lo) >> 2);
    hooks.onProbe?.(lo, hi, m1, m2);
    if (arr[m1]! < arr[m2]!) {
      lo = m1 + 1;
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      hi = m2 - 1;
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  // 剩下 <= 3 个元素，线性取最大
  let best = lo;
  for (let k = lo + 1; k <= hi; k++) {
    if (arr[k]! > arr[best]!) best = k;
  }
  hooks.onDone?.(best);
  return best;
}
