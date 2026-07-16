// =============================================================================
// 囚徒困境 · 纯算法实现
// 标准收益 (行玩家)：T=0(背叛对手合作), R=-1(双方合作), P=-3(双方背叛), S=-5(合作对手背叛)
// 即背叛诱惑 T > 奖励 R > 惩罚 P > 被骗 S。这里用经典 (3,3),(0,5),(5,0),(1,1) 便于阅读：
// 行收益矩阵：
//        C      D
//   C   3      0
//   D   5      1
// 列收益矩阵（对称）相同。
// 唯一纯纳什：(D,D)。社会最优：(C,C)。
// =============================================================================
export interface GamePrisonersDilemmaHooks {
  onBestResponse?: (player: 'row' | 'col', fixed: number, bestAction: number) => void;
  onConclude?: (nashCells: Array<[number, number]>, socialOptimum: [number, number]) => void;
}

const ROW: ReadonlyArray<readonly number[]> = [
  [3, 0],
  [5, 1],
];
const COL: ReadonlyArray<readonly number[]> = [
  [3, 5],
  [0, 1],
];

export interface PdResult {
  nashCells: Array<[number, number]>;
  socialOptimum: [number, number];
}

export function gamePrisonersDilemma(hooks: GamePrisonersDilemmaHooks = {}): PdResult {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      // 行最佳响应（固定 j）
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      // 列最佳响应（固定 i）
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      hooks.onBestResponse?.('row', j, rb);
      hooks.onBestResponse?.('col', i, cb);
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  // 社会最优 = 行+列收益最大
  let bestSum = -Infinity;
  let socialOptimum: [number, number] = [0, 0];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const s = ROW[i]![j]! + COL[i]![j]!;
      if (s > bestSum) {
        bestSum = s;
        socialOptimum = [i, j];
      }
    }
  }
  hooks.onConclude?.(nashCells, socialOptimum);
  return { nashCells, socialOptimum };
}
