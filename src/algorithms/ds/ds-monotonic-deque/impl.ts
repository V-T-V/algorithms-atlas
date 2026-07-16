// =============================================================================
// 单调双端队列（滑动窗口最值）· 纯算法实现
// =============================================================================

export interface MonotonicDequeHooks {
  /** 窗口右端推进到 i。 */
  onAdvance?: (i: number) => void;
  /** 从队尾弹出下标 popped（值更劣）。 */
  onPopBack?: (popped: number) => void;
  /** i 入队尾。 */
  onPushBack?: (i: number) => void;
  /** 队首下标超出窗口被弹出。 */
  onPopFront?: (popped: number) => void;
  /** 确定 i-k+1 窗口的最值下标与值。 */
  onWindow?: (start: number, argmax: number, value: number) => void;
}

export interface WindowResult {
  /** 每个窗口的最值。 */
  values: number[];
  /** 每个窗口最值对应的下标。 */
  indices: number[];
}

/**
 * 滑动窗口最大值。
 * @param arr 数据
 * @param k 窗口长度
 */
export function slidingWindowMax(
  arr: number[],
  k: number,
  hooks: MonotonicDequeHooks = {},
): WindowResult {
  return slidingWindow(arr, k, true, hooks);
}

/** 滑动窗口最小值。 */
export function slidingWindowMin(
  arr: number[],
  k: number,
  hooks: MonotonicDequeHooks = {},
): WindowResult {
  return slidingWindow(arr, k, false, hooks);
}

function slidingWindow(
  arr: number[],
  k: number,
  isMax: boolean,
  hooks: MonotonicDequeHooks,
): WindowResult {
  const n = arr.length;
  const values: number[] = [];
  const indices: number[] = [];
  if (k <= 0 || n === 0) return { values, indices };
  const dq: number[] = []; // 存下标
  const better = (a: number, b: number): boolean => (isMax ? a > b : a < b);

  for (let i = 0; i < n; i++) {
    hooks.onAdvance?.(i);
    // 队首超出窗口
    while (dq.length > 0 && dq[0]! <= i - k) {
      const popped = dq.shift()!;
      hooks.onPopFront?.(popped);
    }
    // 队尾弹出不如新元素优的
    while (dq.length > 0 && better(arr[i]!, arr[dq[dq.length - 1]!]!)) {
      const popped = dq.pop()!;
      hooks.onPopBack?.(popped);
    }
    dq.push(i);
    hooks.onPushBack?.(i);
    // 第一个完整窗口在 i = k-1
    if (i >= k - 1) {
      const argIdx = dq[0]!;
      hooks.onWindow?.(i - k + 1, argIdx, arr[argIdx]!);
      values.push(arr[argIdx]!);
      indices.push(argIdx);
    }
  }
  return { values, indices };
}
