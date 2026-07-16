// =============================================================================
// 组合总和 III（Combination Sum III）· 纯算法实现
// 从 1..9 选 k 个不同数字使其和为 n。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CombinationSum3Hooks {
  /** 尝试选取数字 v（从 start 开始）。 */
  onPick?: (v: number, chosen: number[], remaining: number, left: number) => void;
  /** 剪枝：当前分支不可能凑成解。 */
  onPrune?: (
    reason: 'too-small' | 'too-large' | 'too-few',
    remaining: number,
    left: number,
  ) => void;
  /** 回溯：撤销数字 v。 */
  onBacktrack?: (v: number, chosen: number[]) => void;
  /** 找到一个有效组合。 */
  onCombination?: (combo: number[]) => void;
}

/**
 * 从 1..9 选 k 个不同数字使其和为 n。
 *
 * @param k 要选的个数
 * @param n 目标和
 * @param hooks 可选事件钩子
 * @returns 所有有效组合（升序）
 */
export function combinationSum3(
  k: number,
  n: number,
  hooks: CombinationSum3Hooks = {},
): number[][] {
  const result: number[][] = [];
  const chosen: number[] = [];

  const backtrack = (start: number, remaining: number, left: number): void => {
    if (left === 0) {
      if (remaining === 0) {
        const snap = [...chosen];
        result.push(snap);
        hooks.onCombination?.(snap);
      }
      return;
    }
    // 可选范围：start..9
    for (let v = start; v <= 9; v++) {
      // 剪枝：v 已经超过剩余目标
      if (v > remaining) {
        hooks.onPrune?.('too-large', remaining, left);
        break;
      }
      // 剪枝：剩余可选个数不够凑 left 个
      if (9 - v + 1 < left) {
        hooks.onPrune?.('too-few', remaining, left);
        break;
      }
      chosen.push(v);
      hooks.onPick?.(v, [...chosen], remaining - v, left - 1);
      backtrack(v + 1, remaining - v, left - 1);
      chosen.pop();
      hooks.onBacktrack?.(v, [...chosen]);
    }
  };

  backtrack(1, n, k);
  return result;
}
