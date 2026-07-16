// =============================================================================
// 拼接最大数（Create Maximum Number）· 纯算法实现
// 1) 单调栈取单数组最大子序列；2) 字典序合并；3) 枚举分配。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface CreateMaximumNumberHooks {
  /** 尝试某分配 (i, k-i) 得到合并序列。 */
  onSplit?: (i: number, sub1: number[], sub2: number[], merged: number[]) => void;
  /** 更新全局最优。 */
  onUpdate?: (best: number[]) => void;
  /** 结论。 */
  onConclude?: (result: number[]) => void;
}

/** 从单个数组 nums 中取 t 个数字，使子序列最大（保持相对顺序）。用单调栈。 */
function maxSubsequence(nums: readonly number[], t: number): number[] {
  const drop = nums.length - t;
  const stack: number[] = [];
  for (const x of nums) {
    while (stack.length > 0 && drop > 0 && stack[stack.length - 1]! < x) {
      stack.pop();
    }
    stack.push(x);
    if (stack.length > nums.length - drop && stack.length > t) {
      // 不裁剪；由 drop 控制弹出次数
    }
  }
  // 若 drop 未用完（数组非递减），截断到 t
  return stack.slice(0, t);
}

/** 合并两个子序列成最大数（字典序贪心）。 */
function merge(a: readonly number[], b: readonly number[]): number[] {
  const res: number[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    // 取较大者；相等则比较后续
    if (greater(a, i, b, j)) {
      res.push(a[i]!);
      i++;
    } else {
      res.push(b[j]!);
      j++;
    }
  }
  while (i < a.length) {
    res.push(a[i]!);
    i++;
  }
  while (j < b.length) {
    res.push(b[j]!);
    j++;
  }
  return res;
}

/** 比较 a[i..] 与 b[j..] 的字典序：a 更大返回 true。 */
function greater(a: readonly number[], i: number, b: readonly number[], j: number): boolean {
  let x = i;
  let y = j;
  while (x < a.length && y < b.length) {
    if (a[x]! !== b[y]!) return a[x]! > b[y]!;
    x++;
    y++;
  }
  // a 还有剩余则 a 更大
  return x < a.length;
}

/** 数字数组比较：a 是否严格大于 b（字典序）。 */
function arrGreater(a: readonly number[], b: readonly number[]): boolean {
  const m = Math.min(a.length, b.length);
  for (let i = 0; i < m; i++) {
    if (a[i]! !== b[i]!) return a[i]! > b[i]!;
  }
  return a.length > b.length;
}

/**
 * 拼接最大数：从两个数组拼成最大 k 位数。
 *
 * @param nums1 数组 1
 * @param nums2 数组 2
 * @param k 目标位数
 * @param hooks 可选事件钩子
 * @returns 最大数（数字数组）
 */
export function createMaximumNumber(
  nums1: readonly number[],
  nums2: readonly number[],
  k: number,
  hooks: CreateMaximumNumberHooks = {},
): number[] {
  const m = nums1.length;
  const n = nums2.length;
  let best: number[] = [];

  for (let i = Math.max(0, k - n); i <= Math.min(k, m); i++) {
    const sub1 = maxSubsequence(nums1, i);
    const sub2 = maxSubsequence(nums2, k - i);
    const merged = merge(sub1, sub2);
    hooks.onSplit?.(i, sub1, sub2, merged);
    if (best.length === 0 || arrGreater(merged, best)) {
      best = merged;
      hooks.onUpdate?.([...best]);
    }
  }
  hooks.onConclude?.(best);
  return best;
}
