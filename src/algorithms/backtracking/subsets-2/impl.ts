// =============================================================================
// 子集 II（Subsets II）· 纯算法实现
// 含重复元素的数组，枚举所有不重复子集。
// 关键：先排序，回溯时「同层跳过重复」。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface Subsets2Hooks {
  /** 选择从下标 index 开始的某个元素加入子集。 */
  onPick?: (index: number, value: number, chosen: number[]) => void;
  /** 同层剪枝：跳过重复元素（index 处与 index-1 处同值，且 index > start）。 */
  onPrune?: (index: number, value: number) => void;
  /** 回溯：撤销对下标 index 元素的选择。 */
  onBacktrack?: (index: number, value: number, chosen: number[]) => void;
  /** 收集到一个完整子集。 */
  onSubset?: (subset: number[]) => void;
}

/**
 * 枚举含重复元素数组的所有不重复子集。
 *
 * @param arr 源数组（会被克隆；入参不被修改）
 * @param hooks 可选事件钩子
 * @returns 所有不重复子集
 */
export function subsets2(arr: readonly number[], hooks: Subsets2Hooks = {}): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const result: number[][] = [];
  const chosen: number[] = [];
  const n = sorted.length;

  const backtrack = (start: number): void => {
    // 每个节点（含空集）都是一个子集
    const snap = [...chosen];
    result.push(snap);
    hooks.onSubset?.(snap);

    for (let i = start; i < n; i++) {
      // 同层去重：i > start 时，若与上一个相同则跳过
      if (i > start && sorted[i] === sorted[i - 1]) {
        hooks.onPrune?.(i, sorted[i]!);
        continue;
      }
      chosen.push(sorted[i]!);
      hooks.onPick?.(i, sorted[i]!, [...chosen]);
      backtrack(i + 1);
      chosen.pop();
      hooks.onBacktrack?.(i, sorted[i]!, [...chosen]);
    }
  };

  backtrack(0);
  return result;
}
