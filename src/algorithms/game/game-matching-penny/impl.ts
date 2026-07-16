// =============================================================================
// 猜硬币 (Matching Pennies) · 纯算法实现
// 行玩家收益矩阵（列玩家相反）：
//        H     T
//   H   +1    -1
//   T   -1    +1
// 行希望相同，列希望不同。求纯策略纳什均衡与最优混合概率。
// =============================================================================
export interface GameMatchingPennyHooks {
  onBestResponse?: (
    player: 'row' | 'col',
    fixed: number,
    bestAction: number,
    payoff: number,
  ) => void;
  onConclude?: (
    hasPureNash: boolean,
    nashCells: Array<[number, number]>,
    mixedProb: number,
  ) => void;
}

const ROW_PAYOFF: ReadonlyArray<readonly number[]> = [
  [1, -1],
  [-1, 1],
];

/** 行玩家在列固定 j 时的最佳行动。 */
function rowBest(j: number): { action: number; payoff: number } {
  if (ROW_PAYOFF[0]![j]! >= ROW_PAYOFF[1]![j]!) {
    return { action: 0, payoff: ROW_PAYOFF[0]![j]! };
  }
  return { action: 1, payoff: ROW_PAYOFF[1]![j]! };
}

/** 列玩家在行固定 i 时的最佳行动（列收益 = -行收益，列要最大化自身即最小化行收益）。 */
function colBest(i: number): { action: number; payoff: number } {
  if (ROW_PAYOFF[i]![0]! <= ROW_PAYOFF[i]![1]!) {
    return { action: 0, payoff: -ROW_PAYOFF[i]![0]! };
  }
  return { action: 1, payoff: -ROW_PAYOFF[i]![1]! };
}

export interface MatchingPennyResult {
  hasPureNash: boolean;
  nashCells: Array<[number, number]>;
  mixedProb: number; // 双方选 0(H) 的最优概率，对称均为 0.5
}

export function gameMatchingPenny(hooks: GameMatchingPennyHooks = {}): MatchingPennyResult {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = rowBest(j);
      const cb = colBest(i);
      hooks.onBestResponse?.('row', j, rb.action, rb.payoff);
      hooks.onBestResponse?.('col', i, cb.action, cb.payoff);
      if (rb.action === i && cb.action === j) {
        nashCells.push([i, j]);
      }
    }
  }
  const hasPureNash = nashCells.length > 0;
  hooks.onConclude?.(hasPureNash, nashCells, 0.5);
  return { hasPureNash, nashCells, mixedProb: 0.5 };
}
