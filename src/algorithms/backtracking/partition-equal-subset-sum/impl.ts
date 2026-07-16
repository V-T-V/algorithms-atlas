// =============================================================================
// 等分割子集和（Partition Equal Subset Sum）· 纯算法实现
// 用回溯 + 记忆化（也可视为 0/1 背包）判断能否选出和为 total/2 的子集。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PartitionEqualSubsetSumHooks {
  /** 尝试将下标 i 的元素纳入当前子集。 */
  onInclude?: (index: number, value: number, currentSum: number, target: number) => void;
  /** 跳过下标 i 的元素。 */
  onExclude?: (index: number, value: number, currentSum: number, target: number) => void;
  /** 记忆化命中（该子问题已求过）。 */
  onMemoHit?: (index: number, currentSum: number) => void;
  /** 找到一组可行子集（元素下标列表）。 */
  onSolution?: (indices: number[]) => void;
}

export interface PartitionResult {
  /** 是否能等分。 */
  canPartition: boolean;
  /** 一组可行子集（元素值列表），canPartition 为 false 时为空。 */
  subset: number[];
}

/**
 * 判断数组能否分成两个和相等的子集（回溯 + 记忆化）。
 *
 * @param nums 正整数数组
 * @param hooks 可选事件钩子
 */
export function partitionEqualSubsetSum(
  nums: readonly number[],
  hooks: PartitionEqualSubsetSumHooks = {},
): PartitionResult {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return { canPartition: false, subset: [] };
  const target = total / 2;
  if (nums.length === 0) return { canPartition: target === 0, subset: [] };

  // 降序排序 + 记录原始值，便于剪枝
  const arr = [...nums].sort((a, b) => b - a);
  if (arr[0]! > target) return { canPartition: false, subset: [] };

  // 记忆化：visited[i][sum] = 是否已搜过该状态（false 表未定）。用 Map 更省。
  const memo = new Map<string, boolean>();
  const chosen: number[] = [];
  let found = false;

  // 后缀和（升序下标），用于剪枝：剩余元素之和不够补齐 target
  const suffixSum: number[] = new Array<number>(arr.length + 1).fill(0);
  for (let i = arr.length - 1; i >= 0; i--) {
    suffixSum[i] = suffixSum[i + 1]! + arr[i]!;
  }

  const backtrack = (i: number, currentSum: number): boolean => {
    if (found) return true;
    if (currentSum === target) return true;
    if (currentSum > target) return false;
    if (i >= arr.length) return false;
    // 剪枝：剩余元素之和不足
    if (currentSum + suffixSum[i]! < target) return false;
    const key = `${i},${currentSum}`;
    if (memo.has(key)) {
      hooks.onMemoHit?.(i, currentSum);
      return memo.get(key)!;
    }

    // 选 arr[i]
    chosen.push(arr[i]!);
    hooks.onInclude?.(i, arr[i]!, currentSum + arr[i]!, target);
    if (backtrack(i + 1, currentSum + arr[i]!)) {
      memo.set(key, true);
      found = true;
      return true;
    }
    chosen.pop();

    // 不选 arr[i]
    hooks.onExclude?.(i, arr[i]!, currentSum, target);
    const res = backtrack(i + 1, currentSum);
    memo.set(key, res);
    return res;
  };

  const ok = backtrack(0, 0);
  if (ok) {
    hooks.onSolution?.([...chosen]);
    return { canPartition: true, subset: [...chosen] };
  }
  return { canPartition: false, subset: [] };
}
