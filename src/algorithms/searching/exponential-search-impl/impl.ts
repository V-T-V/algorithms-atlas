// =============================================================================
// 指数搜索（Exponential Search）· 纯算法实现
// 倍增定位上界 + 区间二分。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ExponentialSearchHooks {
  /** 倍增探测到下标 pos。 */
  onBound?: (pos: number) => void;
  /** 已定位候选区间 [lo, hi]。 */
  onWindow?: (lo: number, hi: number) => void;
  /** 二分时比较中点 mid。 */
  onProbe?: (lo: number, mid: number, hi: number) => void;
  /** 查找结束：命中下标或 -1。 */
  onDone?: (foundIndex: number) => void;
}

/** 在升序数组 a[lo..hi] 中二分查找 target，返回其下标或 -1。 */
function binarySearch(
  a: readonly number[],
  lo: number,
  hi: number,
  target: number,
  hooks: ExponentialSearchHooks,
): number {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    hooks.onProbe?.(lo, mid, hi);
    if (a[mid]! === target) return mid;
    if (a[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/**
 * 指数搜索：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 * 步长按 2 的幂倍增定位上界，再二分。时间 O(log p)，空间 O(1)。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function exponentialSearch(
  arr: readonly number[],
  target: number,
  hooks: ExponentialSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }

  // 直接命中首元素
  if (arr[0]! === target) {
    hooks.onDone?.(0);
    return 0;
  }

  // 倍增定位上界
  let i = 1;
  while (i < n && arr[i]! <= target) {
    hooks.onBound?.(i);
    i <<= 1;
  }
  hooks.onWindow?.(i >> 1, Math.min(i, n - 1));

  const found = binarySearch(arr, i >> 1, Math.min(i, n - 1), target, hooks);
  hooks.onDone?.(found);
  return found;
}
