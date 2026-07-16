// =============================================================================
// 单调栈：对每个 i 求右边首个比 a[i] 大的位置（next greater element）
// =============================================================================

export interface MonoStackHooks {
  onPush?: (i: number, v: number) => void;
  onPop?: (popped: number, by: number) => void;
  onDone?: (result: number[]) => void;
}

export function nextGreater(arr: number[], hooks: MonoStackHooks = {}): number[] {
  const n = arr.length;
  const res = new Array(n).fill(-1);
  const stack: number[] = []; // 存下标，对应的值单调递减
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    while (stack.length > 0 && arr[stack[stack.length - 1]!]! < v) {
      const top = stack.pop()!;
      res[top] = i;
      hooks.onPop?.(top, i);
    }
    stack.push(i);
    hooks.onPush?.(i, v);
  }
  hooks.onDone?.(res);
  return res;
}

/** 左边首个更大元素的下标，没有则 -1。 */
export function prevGreater(arr: number[]): number[] {
  const n = arr.length;
  const res = new Array(n).fill(-1);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && arr[stack[stack.length - 1]!]! <= arr[i]!) {
      stack.pop();
    }
    if (stack.length > 0) res[i] = stack[stack.length - 1]!;
    stack.push(i);
  }
  return res;
}
