// =============================================================================
// 火柴拼正方形（Matchsticks to Square）· 纯算法实现
// 回溯把每根火柴分配到 4 条边之一；降序排序 + 等价边剪枝。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MatchsticksToSquareHooks {
  /** 把下标 index 的火柴放入第 edge 条边。 */
  onPlace?: (index: number, length: number, edge: number, sides: number[]) => void;
  /** 回溯：从第 edge 条边移除下标 index 的火柴。 */
  onBacktrack?: (index: number, length: number, edge: number, sides: number[]) => void;
  /** 剪枝：放入失败（超长或等价边）。 */
  onPrune?: (index: number, length: number, edge: number, reason: 'overflow' | 'equiv') => void;
  /** 找到一组成功分配。 */
  onSuccess?: (sides: number[]) => void;
}

export interface MatchstickResult {
  canForm: boolean;
  /** 4 条边的最终长度（成功时均为 side）。 */
  sides: number[];
}

/**
 * 判断能否用所有火柴拼成正方形。
 *
 * @param matchsticks 各火柴长度
 * @param hooks 可选事件钩子
 */
export function matchsticksToSquare(
  matchsticks: readonly number[],
  hooks: MatchsticksToSquareHooks = {},
): MatchstickResult {
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total === 0) return { canForm: false, sides: [0, 0, 0, 0] };
  if (total % 4 !== 0) return { canForm: false, sides: [0, 0, 0, 0] };
  const side = total / 4;
  // 任一火柴超过边长 → 不可能
  if (matchsticks.some((m) => m > side)) return { canForm: false, sides: [0, 0, 0, 0] };

  // 降序排序，先放大数便于剪枝
  const arr = [...matchsticks].sort((a, b) => b - a);
  const sides: number[] = [0, 0, 0, 0];

  const backtrack = (idx: number): boolean => {
    if (idx === arr.length) {
      return sides.every((s) => s === side);
    }
    const len = arr[idx]!;
    for (let e = 0; e < 4; e++) {
      // 超长剪枝
      if (sides[e]! + len > side) {
        hooks.onPrune?.(idx, len, e, 'overflow');
        continue;
      }
      // 等价边剪枝：若本边与前一已尝试边长度相同且失败过，跳过
      let equiv = false;
      for (let k = 0; k < e; k++) {
        if (sides[k] === sides[e]) {
          equiv = true;
          break;
        }
      }
      if (equiv) {
        hooks.onPrune?.(idx, len, e, 'equiv');
        continue;
      }
      sides[e]! += len;
      hooks.onPlace?.(idx, len, e, [...sides]);
      if (backtrack(idx + 1)) return true;
      sides[e]! -= len;
      hooks.onBacktrack?.(idx, len, e, [...sides]);
    }
    return false;
  };

  const ok = backtrack(0);
  if (ok) hooks.onSuccess?.([...sides]);
  return { canForm: ok, sides: ok ? sides : [0, 0, 0, 0] };
}
