// =============================================================================
// 全排列 Permutations · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 采用经典的「交换」回溯：固定第 first 位，依次把它与后面的每个位置交换。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PermutationsHooks {
  /** 在第 first 位与第 i 位交换前（尝试把 i 号元素放到 first 位）。 */
  onSwap?: (first: number, i: number) => void;
  /** 第 first 位、第 i 位交换被撤销（回溯）。 */
  onUnswap?: (first: number, i: number) => void;
  /** 找到一个完整排列（传入当前 arr 的快照）。 */
  onPermutation?: (perm: number[]) => void;
}

/**
 * 生成数组元素的全排列（原地交换回溯）。
 *
 * @param arr 待排列数组（不会修改入参；内部克隆）
 * @param hooks 可选事件钩子
 * @param options options.maxPermutations 限制收集数量（默认全部）
 * @returns 所有全排列
 */
export function permutations(
  arr: readonly number[],
  hooks: PermutationsHooks = {},
  options: { maxPermutations?: number } = {},
): number[][] {
  const { maxPermutations = Infinity } = options;
  const result: number[][] = [];
  const a = [...arr];
  const n = a.length;

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const backtrack = (first: number): void => {
    if (first === n) {
      result.push([...a]);
      hooks.onPermutation?.([...a]);
      return;
    }
    for (let i = first; i < n; i++) {
      hooks.onSwap?.(first, i);
      swap(first, i);
      backtrack(first + 1);
      swap(first, i); // 撤销
      hooks.onUnswap?.(first, i);
      if (result.length >= maxPermutations) return;
    }
  };

  backtrack(0);
  return result;
}

/** 阶乘（用于断言总数 n!）。 */
export function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
