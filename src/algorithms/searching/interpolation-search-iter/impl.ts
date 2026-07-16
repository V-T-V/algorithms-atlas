// =============================================================================
// 插值搜索（迭代版）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface InterpSearchIterHooks {
  /** 在 [lo,hi] 之间估计出探测点 pos（值为 v）。 */
  onProbe?: (lo: number, hi: number, pos: number, v: number) => void;
  /** 比较探测点值与 target：cmp < 0 表示 v < target，>0 表示 v > target，=0 命中。 */
  onCompare?: (pos: number, cmp: number) => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/**
 * 插值搜索（迭代版）：在**升序**且尽量均匀分布的数组中查找 target。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 * @returns 命中下标；不存在返回 -1
 */
export function interpolationSearchIter(
  arr: readonly number[],
  target: number,
  hooks: InterpSearchIterHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }
  let lo = 0;
  let hi = n - 1;

  while (lo <= hi && target >= arr[lo]! && target <= arr[hi]!) {
    if (lo === hi) {
      hooks.onProbe?.(lo, hi, lo, arr[lo]!);
      if (arr[lo]! === target) {
        hooks.onCompare?.(lo, 0);
        hooks.onDone?.(lo);
        return lo;
      }
      hooks.onDone?.(-1);
      return -1;
    }
    // 插值公式
    const num = (target - arr[lo]!) * (hi - lo);
    const den = arr[hi]! - arr[lo]!;
    const pos = lo + (den === 0 ? 0 : Math.floor(num / den));
    const v = arr[pos]!;
    hooks.onProbe?.(lo, hi, pos, v);
    const cmp = v < target ? -1 : v > target ? 1 : 0;
    hooks.onCompare?.(pos, cmp);
    if (cmp === 0) {
      hooks.onDone?.(pos);
      return pos;
    }
    if (cmp < 0) lo = pos + 1;
    else hi = pos - 1;
  }
  hooks.onDone?.(-1);
  return -1;
}
