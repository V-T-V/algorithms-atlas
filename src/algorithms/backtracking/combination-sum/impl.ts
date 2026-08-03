// =============================================================================
// 组合总和（Combination Sum）· 纯算法实现
// 经典回溯：从无重复正整数候选集 candidates 中选出任意多个（可重复选），
// 使其和恰为 target。返回所有「不重复的组合」（候选按索引去重，天然无序）。
//
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步：
//   - onPick / onBacktrack：选中/撤销某个候选
//   - onSkip：跳过某个候选（剪枝或已超过剩余）
//   - onResult：找到一个完整组合
//   - onDone：搜索结束，给出全部组合
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CombinationSumHooks {
  /** 把候选 candidates[i] 加入当前组合（剩余 remain）。 */
  onPick?: (value: number, index: number, remain: number) => void;
  /** 撤销最近一次 onPick（回溯）。 */
  onBacktrack?: (value: number, index: number) => void;
  /** 跳过候选 candidates[i]（剪枝：超出剩余）。 */
  onSkip?: (value: number, index: number, remain: number) => void;
  /** 找到一个完整组合。 */
  onResult?: (combo: number[]) => void;
  /** 搜索结束。 */
  onDone?: (combos: number[][]) => void;
}

/**
 * 求所有「候选可重复使用」的组合，使其元素之和等于 target。
 *
 * 去重策略：递归时只向后看（`start` 不回退），从而避免同一组合以不同顺序重复出现。
 *
 * @param candidates 候选正整数（建议无重复；若有重复，结果可能含等价组合）
 * @param target 目标和
 * @param hooks 可选事件钩子
 * @returns 全部合法组合
 */
export function combinationsum(
  candidates: readonly number[],
  target: number,
  hooks: CombinationSumHooks = {},
): number[][] {
  if (target < 0) return [];
  // 预排序：使剪枝更高效（一旦候选 > remain，后续更大的也可整体跳过）
  const indexed = candidates
    .map((v, i) => ({ v, i }))
    .filter((x) => Number.isInteger(x.v) && x.v > 0);
  indexed.sort((a, b) => a.v - b.v);
  const vals = indexed.map((x) => x.v);

  const out: number[][] = [];
  const cur: number[] = [];

  const backtrack = (start: number, remain: number): void => {
    if (remain === 0) {
      out.push([...cur]);
      hooks.onResult?.([...cur]);
      return;
    }
    for (let p = start; p < vals.length; p++) {
      const v = vals[p]!;
      if (v > remain) {
        // 已排序，后续只会更大 → 剪枝
        hooks.onSkip?.(v, indexed[p]!.i, remain);
        break;
      }
      cur.push(v);
      hooks.onPick?.(v, indexed[p]!.i, remain - v);
      // 同一候选可重复使用 → 下一轮仍从 p 开始
      backtrack(p, remain - v);
      cur.pop();
      hooks.onBacktrack?.(v, indexed[p]!.i);
    }
  };

  backtrack(0, target);
  hooks.onDone?.(out);
  return out;
}
