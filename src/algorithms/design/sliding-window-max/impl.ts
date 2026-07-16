// 滑动窗口最大值（单调队列）· 纯算法实现

/** 事件钩子。 */
export interface SlidingWindowMaxHooks {
  /** 处理位置 i：把 i 入队（先弹出尾部比 a[i] 小的）。 */
  onEnqueue?: (i: number, value: number, deque: number[]) => void;
  /** 从队尾弹出过期/较小的下标。 */
  onPopBack?: (i: number, popped: number) => void;
  /** 队头下标已超出窗口，弹出。 */
  onPopFront?: (i: number, popped: number) => void;
  /** 记录第 i 个窗口的最大值（窗口右端 i，最大值 maxVal）。 */
  onWindowMax?: (i: number, maxIdx: number, maxVal: number) => void;
}

/**
 * 求数组每个大小为 k 的滑动窗口的最大值。
 * @returns 每个窗口的最大值数组（长度 n-k+1）
 */
export function slidingWindowMax(
  arr: readonly number[],
  k: number,
  hooks: SlidingWindowMaxHooks = {},
): number[] {
  if (k <= 0) throw new RangeError('k must be positive');
  if (k > arr.length) throw new RangeError('k larger than array length');
  const n = arr.length;
  const deque: number[] = []; // 存下标，对应值单调递减
  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    // 弹出队尾所有 <= a[i] 的
    while (deque.length > 0 && arr[deque[deque.length - 1]!]! <= arr[i]!) {
      const popped = deque.pop()!;
      hooks.onPopBack?.(i, popped);
    }
    deque.push(i);
    hooks.onEnqueue?.(i, arr[i]!, [...deque]);
    // 队头超出窗口
    while (deque.length > 0 && deque[0]! <= i - k) {
      const popped = deque.shift()!;
      hooks.onPopFront?.(i, popped);
    }
    // 当 i >= k-1，开始记录
    if (i >= k - 1) {
      const maxIdx = deque[0]!;
      hooks.onWindowMax?.(i, maxIdx, arr[maxIdx]!);
      result.push(arr[maxIdx]!);
    }
  }
  return result;
}
