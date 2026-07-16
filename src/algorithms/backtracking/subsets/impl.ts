// =============================================================================
// 子集枚举 Subsets · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典回溯：对每个元素做「选 / 不选」二叉决策，构成深度为 n 的二叉搜索树。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SubsetsHooks {
  /** 决定是否选取下标 index 的元素（include=true 表示选取）。 */
  onDecide?: (index: number, include: boolean) => void;
  /** 回溯：撤销对下标 index 元素的选择。 */
  onBacktrack?: (index: number, include: boolean) => void;
  /** 收集到一个完整子集（传入当前 chosen 的快照）。 */
  onSubset?: (subset: number[]) => void;
}

/**
 * 枚举数组的所有子集（幂集），共 2^n 个。
 * 回溯思路：从下标 0 开始，每个元素面临「选 / 不选」两种决策。
 *
 * @param arr 源数组
 * @param hooks 可选事件钩子
 * @param options options.maxSubsets 限制收集数量（默认全部）
 * @returns 所有子集（含空集与全集）
 */
export function subsets(
  arr: readonly number[],
  hooks: SubsetsHooks = {},
  options: { maxSubsets?: number } = {},
): number[][] {
  const { maxSubsets = Infinity } = options;
  const result: number[][] = [];
  const chosen: number[] = [];
  const n = arr.length;

  const backtrack = (index: number): void => {
    if (result.length >= maxSubsets) return;
    if (index === n) {
      const snap = [...chosen];
      result.push(snap);
      hooks.onSubset?.(snap);
      return;
    }
    // 1) 不选 index
    hooks.onDecide?.(index, false);
    backtrack(index + 1);
    hooks.onBacktrack?.(index, false);
    if (result.length >= maxSubsets) return;
    // 2) 选 index
    hooks.onDecide?.(index, true);
    chosen.push(arr[index]!);
    backtrack(index + 1);
    chosen.pop();
    hooks.onBacktrack?.(index, true);
  };

  backtrack(0);
  return result;
}
