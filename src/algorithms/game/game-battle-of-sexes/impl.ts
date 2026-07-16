// =============================================================================
// 性别战博弈 · 纯算法实现
// 行(丈夫)收益：        列(妻子)收益：
//        O    F                O    F
//   O    3    0           O    2    0
//   F    0    2           F    0    3
// 行偏好 O(O=3)，列偏好 F(F=3)。两个纯纳什 (O,O) 和 (F,F)。
// =============================================================================
export interface GameBattleOfSexesHooks {
  onConclude?: (
    nashCells: Array<[number, number]>,
    mixedRowProb: number,
    mixedColProb: number,
  ) => void;
}

const ROW: ReadonlyArray<readonly number[]> = [
  [3, 0],
  [0, 2],
];
const COL: ReadonlyArray<readonly number[]> = [
  [2, 0],
  [0, 3],
];

export interface BosResult {
  nashCells: Array<[number, number]>;
  mixedRowProb: number; // 行选 O 的概率
  mixedColProb: number; // 列选 O 的概率
}

export function gameBattleOfSexes(hooks: GameBattleOfSexesHooks = {}): BosResult {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  // 混合策略：使对手无差异。列选 O 概率 q 使行无差异：3q = 2(1-q) → q=2/5
  const mixedColProb = 2 / 5;
  // 行选 O 概率 p 使列无差异：2p = 3(1-p) → p=3/5
  const mixedRowProb = 3 / 5;
  hooks.onConclude?.(nashCells, mixedRowProb, mixedColProb);
  return { nashCells, mixedRowProb, mixedColProb };
}
