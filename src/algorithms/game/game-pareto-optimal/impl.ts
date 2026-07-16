// =============================================================================
// 帕累托最优 · 纯算法实现（2x2 双矩阵博弈）
// 行收益矩阵 ROW 与列收益矩阵 COL。
// 纯策略纳什：(i,j) 同时是行最佳响应（固定 j）与列最佳响应（固定 i）。
// =============================================================================
export interface Game2x2Hooks {
  onBestResponse?: (player: 'row' | 'col', fixed: number, bestAction: number) => void;
  onConclude?: (nashCells: Array<[number, number]>, socialOptimum: [number, number]) => void;
}

const ROW: ReadonlyArray<readonly number[]> = [
  [3, 5],
  [1, 4],
];
const COL: ReadonlyArray<readonly number[]> = [
  [3, 1],
  [5, 4],
];

export interface Game2x2Result {
  nashCells: Array<[number, number]>;
  socialOptimum: [number, number];
}

export function gameParetoOptimal(hooks: Game2x2Hooks = {}): Game2x2Result {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      hooks.onBestResponse?.('row', j, rb);
      hooks.onBestResponse?.('col', i, cb);
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
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
