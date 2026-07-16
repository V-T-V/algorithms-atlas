// =============================================================================
// 飞驰搜索（Gallop Search）· 纯算法实现
// 倍增飞驰定位区间 + 区间二分。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GallopSearchHooks {
  /** 飞驰探测到下标 pos（步长 step）。 */
  onGallop?: (pos: number, step: number) => void;
  /** 已定位到候选区间 [lo, hi]。 */
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
  hooks: GallopSearchHooks,
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
 * 飞驰搜索：在**升序**数组中查找 target，返回其下标；不存在返回 -1。
 * 倍增飞驰定位候选区间，再在区间内二分。时间 O(log p)（p=命中位置），空间 O(1)。
 *
 * @param arr 升序数组
 * @param target 目标值
 * @param hooks 可选的事件钩子
 */
export function gallopSearch(
  arr: readonly number[],
  target: number,
  hooks: GallopSearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(-1);
    return -1;
  }

  // 1. 飞驰定位区间
  if (arr[0]! > target) {
    hooks.onDone?.(-1);
    return -1;
  }
  let step = 1;
  let prev = 0;
  let pos = 0;
  while (pos < n && arr[pos]! <= target) {
    prev = pos;
    hooks.onGallop?.(pos, step);
    pos += step;
    step <<= 1; // 倍增
  }
  const hi = Math.min(pos, n - 1);
  hooks.onWindow?.(prev, hi);

  // 2. 区间二分
  const found = binarySearch(arr, prev, hi, target, hooks);
  hooks.onDone?.(found);
  return found;
}
