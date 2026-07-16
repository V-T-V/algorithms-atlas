// =============================================================================
// 排列生成（Permutation Generation）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每次交换与一个完整排列的产生，供录制器使用。
// 采用「回溯 + 原地交换」法（Heap 算法思想）：固定前缀，对后缀递归生成排列。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PermutationHooks {
  /** 准备交换 a[i] 与 a[j] 以扩展/回溯前缀。给出当前下标 i（固定点）与候选 j。 */
  onSwap?: (i: number, j: number, arr: number[]) => void;
  /** 产生一个完整排列。给出该排列（数组拷贝）与序号（从 0 起）。 */
  onEmit?: (perm: number[], index: number) => void;
  /** 进入/回溯某一层：固定下标 start，当前 arr 状态。 */
  onRecurse?: (start: number, arr: number[]) => void;
}

/**
 * 生成数组的所有全排列（回溯 + 原地交换）。
 *
 * 思路：要把位置 start 固定为不同元素，就把 start..n-1 中每个元素轮流换到 start，
 * 再递归对 start+1..n-1 做同样的事；递归返回后换回（回溯），保证数组恢复原状。
 * 这样无需额外数组，且产生 n! 个排列。
 *
 * @param arr 输入数组（克隆后操作，不改原数组）
 * @param hooks 可选事件钩子
 * @returns 所有排列（n! 个，每项为原元素的一个排列）
 */
export function permutations(arr: readonly number[], hooks: PermutationHooks = {}): number[][] {
  const a = [...arr];
  const result: number[][] = [];

  const swap = (i: number, j: number): void => {
    const t = a[i]!;
    a[i] = a[j]!;
    a[j] = t;
  };

  const recurse = (start: number): void => {
    hooks.onRecurse?.(start, [...a]);
    if (start === a.length - 1) {
      const perm = [...a];
      result.push(perm);
      hooks.onEmit?.(perm, result.length - 1);
      return;
    }
    for (let j = start; j < a.length; j++) {
      hooks.onSwap?.(start, j, [...a]);
      swap(start, j);
      recurse(start + 1);
      swap(start, j); // 回溯
    }
  };

  if (a.length > 0) recurse(0);
  else result.push([]);
  return result;
}

/** 排列数 n!。 */
export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`n 须为非负整数，收到 ${n}`);
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
