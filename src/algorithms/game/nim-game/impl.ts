// =============================================================================
// Nim 博弈（Nim Game）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典组合博弈：n 堆石子，两人轮流，每次从任一堆取任意多（≥1）颗，取走最后一颗者胜。
// 用「异或和（nim-sum）」判定先手必胜/必败，并给出必胜取法。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NimGameHooks {
  /** 计算完每堆的二进制位贡献后，给出当前各堆与 nim-sum。 */
  onNimSum?: (piles: number[], nimSum: number) => void;
  /** 判定先手胜负结论。 */
  onConclude?: (firstPlayerWins: boolean, nimSum: number) => void;
  /** 找到必胜取法（仅在先手必胜时触发）：从第 pileIndex 堆取走 take 颗。 */
  onWinningMove?: (pileIndex: number, take: number, pilesAfter: number[]) => void;
}

/** 求解结果。 */
export interface NimGameResult {
  /** 各堆石子数（与输入相同，便于复用）。 */
  piles: number[];
  /** 异或和（nim-sum）。 */
  nimSum: number;
  /** 先手是否必胜（nimSum ≠ 0 → 必胜）。 */
  firstPlayerWins: boolean;
  /** 必胜取法（先手必胜时给出）：[堆下标, 取走数量]；先手必败时为 null。 */
  winningMove: [number, number] | null;
}

/**
 * Nim 博弈分析：用异或和（nim-sum）判定先手必胜，并给出必胜取法。
 *
 * 定理（Bouton 1901）：令 `nimSum = piles[0] ⊕ piles[1] ⊕ ... ⊕ piles[n−1]`。
 * - 若 `nimSum ≠ 0`，先手**必胜**：存在一种取法使取完后 nimSum 变为 0，
 *   把「必败态」丢给对手。
 * - 若 `nimSum = 0`，先手**必败**：无论怎么取，取完后 nimSum 必 ≠ 0
 *   （因为至少改变了一堆），对手总能恢复 nimSum = 0。
 *
 * 必胜取法：找到一堆 `piles[i]`，使其满足 `piles[i] & nimSum < piles[i]`
 * （等价于 piles[i] 在 nimSum 最高有效位上有 1），则从该堆取走
 * `piles[i] − (piles[i] ⊕ nimSum)` 颗，剩余 `(piles[i] ⊕ nimSum)`，
 * 使整体 nimSum 归零。
 *
 * @param piles 各堆石子数（会被克隆）
 * @param hooks 可选的事件钩子
 */
export function nimGame(piles: readonly number[], hooks: NimGameHooks = {}): NimGameResult {
  const arr = [...piles];

  // 计算 nim-sum（异或和）
  let nimSum = 0;
  for (const p of arr) nimSum ^= p;
  hooks.onNimSum?.(arr, nimSum);

  const firstPlayerWins = nimSum !== 0;
  hooks.onConclude?.(firstPlayerWins, nimSum);

  let winningMove: [number, number] | null = null;
  if (firstPlayerWins) {
    // 找一堆，使 piles[i] ⊕ nimSum < piles[i]（即该堆在 nimSum 最高位为 1）
    for (let i = 0; i < arr.length; i++) {
      const target = arr[i]! ^ nimSum;
      if (target < arr[i]!) {
        const take = arr[i]! - target;
        const after = [...arr];
        after[i] = target;
        winningMove = [i, take];
        hooks.onWinningMove?.(i, take, after);
        break;
      }
    }
  }

  return { piles: arr, nimSum, firstPlayerWins, winningMove };
}
