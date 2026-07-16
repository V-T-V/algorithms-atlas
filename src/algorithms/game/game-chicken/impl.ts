// =============================================================================
// 胆小鬼博弈 · 纯算法实现
// 行收益：              列收益：
//       S    W               S    W
//  S   -6    1          S   -6   -1
//  W   -1    0          W    1    0
// 两个纯纳什：(S,W) 和 (W,S)。混合纳什也存在。
// =============================================================================
export interface GameChickenHooks {
  onConclude?: (nashCells: Array<[number, number]>, mixedProb: number) => void;
}

const ROW: ReadonlyArray<readonly number[]> = [
  [-6, 1],
  [-1, 0],
];
const COL: ReadonlyArray<readonly number[]> = [
  [-6, -1],
  [1, 0],
];

export interface ChickenResult {
  nashCells: Array<[number, number]>;
  mixedProb: number; // 选 S(straight) 的概率
}

export function gameChicken(hooks: GameChickenHooks = {}): ChickenResult {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  // 混合：使对手无差异。列选 S 概率 q 使行无差异：-6q + 1(1-q) = -1q + 0 → -7q+1=0 → q=1/7
  const mixedProb = 1 / 7;
  hooks.onConclude?.(nashCells, mixedProb);
  return { nashCells, mixedProb };
}
