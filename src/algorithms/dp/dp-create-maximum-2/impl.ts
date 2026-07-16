// =============================================================================
// 拼接最大数 · 纯算法实现
// =============================================================================

export interface MaxNumberHooks {
  onTry?: (i: number, sub1: number[], sub2: number[]) => void;
  onDone?: (result: number[]) => void;
}

/** 单数组取 t 位最大子序列（保持相对顺序），用单调栈。 */
function maxSubsequence(nums: readonly number[], t: number): number[] {
  const drop = nums.length - t;
  const stack: number[] = [];
  let dropped = 0;
  for (const x of nums) {
    while (dropped < drop && stack.length > 0 && stack[stack.length - 1]! < x) {
      stack.pop();
      dropped++;
    }
    stack.push(x);
  }
  return stack.slice(0, t);
}

/** 比较两数组字典序，返回 true 表示 a > b。 */
function greater(a: number[], b: number[]): boolean {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i]! > b[i]!) return true;
    if (a[i]! < b[i]!) return false;
  }
  return a.length > b.length;
}

/** 贪心合并两个子序列为最大数。 */
function merge(a: number[], b: number[]): number[] {
  const res: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (greater(a.slice(i), b.slice(j))) {
      res.push(a[i]!);
      i++;
    } else {
      res.push(b[j]!);
      j++;
    }
  }
  return res;
}

export function createMaximumNumber(
  nums1: readonly number[],
  nums2: readonly number[],
  k: number,
  hooks: MaxNumberHooks = {},
): number[] {
  const n = nums1.length;
  const m = nums2.length;
  let best: number[] = [];
  const lo = Math.max(0, k - m);
  const hi = Math.min(k, n);
  for (let i = lo; i <= hi; i++) {
    const sub1 = maxSubsequence(nums1, i);
    const sub2 = maxSubsequence(nums2, k - i);
    hooks.onTry?.(i, sub1, sub2);
    const merged = merge(sub1, sub2);
    if (greater(merged, best)) best = merged;
  }
  hooks.onDone?.(best);
  return best;
}
