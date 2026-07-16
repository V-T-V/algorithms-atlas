// =============================================================================
// 子集和 Subset Sum · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：给定集合 nums 与目标和 target，求一个元素之和恰为 target 的子集（0/1 背包）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SubsetSumHooks {
  /** 开始处理第 i 件物品（0-based）。 */
  onItem?: (i: number) => void;
  /** dp[w] 从 false 变 true（新可达和 w）。 */
  onFillCell?: (w: number) => void;
  /** 回溯：物品 i（0-based）是否被选入。 */
  onBacktrack?: (i: number, w: number, taken: boolean) => void;
  /** 算法完成：是否找到，及子集下标。 */
  onDone?: (found: boolean, subset: number[]) => void;
}

/**
 * 子集和：求 `nums` 的一个子集，使其元素之和恰为 `target`。
 *
 * 0/1 背包 DP：`dp[w]` = 能否凑出和 `w`，`from[w]` = 贡献该和的物品下标（用于回溯）。
 *   - `dp[0] = true`，其余 `false`
 *   - 每件物品倒序：若 `dp[w-x]` 为真而 `dp[w]` 为假，则 `dp[w] = true; from[w] = i`
 *   - 找到 `dp[target]` 即可早停
 *
 * 回溯：从 `w = target` 出发，每次扣去 `from[w]` 对应物品，直到 `w = 0`。
 *
 * 时间 `O(n · target)`，空间 `O(target)`。
 *
 * @param nums 非负整数数组
 * @param target 目标和
 * @returns 被选入物品的 0-based 下标升序数组；不可行返回 `null`
 */
export function subsetSum(
  nums: readonly number[],
  target: number,
  hooks: SubsetSumHooks = {},
): number[] | null {
  const n = nums.length;
  if (target === 0) {
    hooks.onDone?.(true, []);
    return [];
  }
  if (n === 0 || target < 0) {
    hooks.onDone?.(false, []);
    return null;
  }

  const dp = new Array<boolean>(target + 1).fill(false);
  const from = new Array<number>(target + 1).fill(-1);
  dp[0] = true;
  hooks.onFillCell?.(0);

  outer: for (let i = 0; i < n; i++) {
    hooks.onItem?.(i);
    const x = nums[i]!;
    if (x > target) continue;
    for (let w = target; w >= x; w--) {
      if (!dp[w] && dp[w - x]!) {
        dp[w] = true;
        from[w] = i;
        hooks.onFillCell?.(w);
        if (w === target) break outer;
      }
    }
  }

  if (!dp[target]!) {
    hooks.onDone?.(false, []);
    return null;
  }

  // 回溯
  const chosen: number[] = [];
  let w = target;
  while (w > 0) {
    const i = from[w]!;
    hooks.onBacktrack?.(i, w, true);
    chosen.push(i);
    w -= nums[i]!;
  }
  chosen.reverse();
  hooks.onDone?.(true, chosen);
  return chosen;
}
