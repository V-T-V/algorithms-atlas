// =============================================================================
// 滑动窗口聚合 · 纯算法实现
// 提供 sum / max / min 三种聚合的滑动窗口实现：
//   - slidingSum   ：O(n) 滑动累加（入加出减）
//   - slidingMax   ：O(n) 单调递减队列
//   - slidingMin   ：O(n) 单调递增队列
// =============================================================================

export type AggregateKind = 'sum' | 'max' | 'min';

export interface SWAggregateHooks {
  onSlide?: (endIndex: number, windowValues: number[], aggregate: number) => void;
}

/**
 * 滑动窗口求和（每窗一个值）。
 */
export function slidingSum(
  arr: readonly number[],
  k: number,
  hooks: SWAggregateHooks = {},
): number[] {
  if (k <= 0) throw new RangeError('k must be positive');
  if (k > arr.length) throw new RangeError('k larger than array length');
  const result: number[] = [];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]!;
    if (i >= k) sum -= arr[i - k]!;
    if (i >= k - 1) {
      hooks.onSlide?.(i, arr.slice(i - k + 1, i + 1), sum);
      result.push(sum);
    }
  }
  return result;
}

/** 单调队列求每窗最大值。 */
export function slidingMax(
  arr: readonly number[],
  k: number,
  hooks: SWAggregateHooks = {},
): number[] {
  if (k <= 0) throw new RangeError('k must be positive');
  if (k > arr.length) throw new RangeError('k larger than array length');
  const n = arr.length;
  const deque: number[] = []; // 下标，对应值单调递减
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    while (deque.length > 0 && arr[deque[deque.length - 1]!]! <= arr[i]!) deque.pop();
    deque.push(i);
    while (deque.length > 0 && deque[0]! <= i - k) deque.shift();
    if (i >= k - 1) {
      const m = arr[deque[0]!]!;
      hooks.onSlide?.(i, arr.slice(i - k + 1, i + 1), m);
      result.push(m);
    }
  }
  return result;
}

/** 单调队列求每窗最小值。 */
export function slidingMin(
  arr: readonly number[],
  k: number,
  hooks: SWAggregateHooks = {},
): number[] {
  if (k <= 0) throw new RangeError('k must be positive');
  if (k > arr.length) throw new RangeError('k larger than array length');
  const n = arr.length;
  const deque: number[] = []; // 下标，对应值单调递增
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    while (deque.length > 0 && arr[deque[deque.length - 1]!]! >= arr[i]!) deque.pop();
    deque.push(i);
    while (deque.length > 0 && deque[0]! <= i - k) deque.shift();
    if (i >= k - 1) {
      const m = arr[deque[0]!]!;
      hooks.onSlide?.(i, arr.slice(i - k + 1, i + 1), m);
      result.push(m);
    }
  }
  return result;
}

/** 按聚合类型分发。 */
export function slidingAggregate(
  arr: readonly number[],
  k: number,
  kind: AggregateKind,
  hooks: SWAggregateHooks = {},
): number[] {
  if (kind === 'sum') return slidingSum(arr, k, hooks);
  if (kind === 'max') return slidingMax(arr, k, hooks);
  return slidingMin(arr, k, hooks);
}
