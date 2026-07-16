// =============================================================================
// 编辑距离（带操作回溯）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 单步编辑操作。 */
export type EditOp = 'keep' | 'replace' | 'insert' | 'delete';

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface EditDistance2Hooks {
  /** 计算完 DP 后，回溯确定每个字符的编辑操作 op。 */
  onTrace?: (op: EditOp, i: number, j: number) => void;
  /** 计算完成，给出最终距离。 */
  onDone?: (distance: number) => void;
}

/**
 * 编辑距离 + 操作序列回溯：求把 `a` 变成 `b` 的最少编辑次数，并给出具体操作步骤。
 *
 * - 用两行滚动数组计算距离 `O(min) ` 空间……此处为回溯仍存完整矩阵
 * - 距离 DP 同莱文斯坦；之后从 `dp[la][lb]` **回溯**，依据三来源选择最优前驱，
 *   产出从左到右的操作序列（keep/replace/insert/delete）
 *
 * 时间 `O(n·m)`，空间 `O(n·m)`。
 *
 * @returns `{ distance, ops }`：距离与操作序列（从 a 到 b，按 a 的位置顺序）
 */
export function editDistance2(
  a: string,
  b: string,
  hooks: EditDistance2Hooks = {},
): { distance: number; ops: EditOp[] } {
  const la = a.length;
  const lb = b.length;
  const dp: number[][] = Array.from({ length: la + 1 }, () => new Array<number>(lb + 1).fill(0));
  for (let i = 0; i <= la; i++) dp[i]![0] = i;
  for (let j = 0; j <= lb; j++) dp[0]![j] = j;
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + cost);
    }
  }
  const distance = dp[la]![lb]!;

  // 回溯操作序列（逆序再翻转）
  const ops: EditOp[] = [];
  let i = la;
  let j = lb;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && dp[i]![j] === dp[i - 1]![j - 1]) {
      ops.push('keep');
      hooks.onTrace?.('keep', i - 1, j - 1);
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i]![j] === dp[i - 1]![j - 1]! + 1) {
      ops.push('replace');
      hooks.onTrace?.('replace', i - 1, j - 1);
      i--;
      j--;
    } else if (j > 0 && dp[i]![j] === dp[i]![j - 1]! + 1) {
      ops.push('insert');
      hooks.onTrace?.('insert', i, j - 1);
      j--;
    } else {
      ops.push('delete');
      hooks.onTrace?.('delete', i - 1, j);
      i--;
    }
  }
  ops.reverse();
  hooks.onDone?.(distance);
  return { distance, ops };
}
