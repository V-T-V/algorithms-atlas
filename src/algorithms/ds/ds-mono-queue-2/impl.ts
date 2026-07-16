// =============================================================================
// 单调队列：定长 k 的滑动窗口最大值
// =============================================================================

export interface MonoQueueHooks {
  onPush?: (i: number, v: number) => void;
  onPopBack?: (popped: number) => void;
  onPopFront?: (popped: number) => void;
  onWindow?: (l: number, r: number, maxVal: number) => void;
}

export function slidingWindowMax(arr: number[], k: number, hooks: MonoQueueHooks = {}): number[] {
  const n = arr.length;
  if (n === 0 || k === 0) return [];
  const dq: number[] = []; // 下标，对应值单调递减
  const res: number[] = [];
  for (let i = 0; i < n; i++) {
    while (dq.length > 0 && arr[dq[dq.length - 1]!]! <= arr[i]!) {
      const p = dq.pop()!;
      hooks.onPopBack?.(p);
    }
    dq.push(i);
    hooks.onPush?.(i, arr[i]!);
    if (dq[0]! <= i - k) {
      const p = dq.shift()!;
      hooks.onPopFront?.(p);
    }
    if (i >= k - 1) {
      const maxVal = arr[dq[0]!]!;
      res.push(maxVal);
      hooks.onWindow?.(i - k + 1, i, maxVal);
    }
  }
  return res;
}

/** 定长 k 的滑动窗口最小值。 */
export function slidingWindowMin(arr: number[], k: number): number[] {
  const n = arr.length;
  if (n === 0 || k === 0) return [];
  const dq: number[] = [];
  const res: number[] = [];
  for (let i = 0; i < n; i++) {
    while (dq.length > 0 && arr[dq[dq.length - 1]!]! >= arr[i]!) dq.pop();
    dq.push(i);
    if (dq[0]! <= i - k) dq.shift();
    if (i >= k - 1) res.push(arr[dq[0]!]!);
  }
  return res;
}
