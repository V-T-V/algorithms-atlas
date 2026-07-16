// =============================================================================
// 猎鹿博弈 · 纯算法实现
// 行收益（列对称）：         列收益：
//        S    H                    S    H
//   S    4    0               S    4    2
//   H    2    2               H    0    2
// 两个纯纳什：(S,S) 收益占优；(H,H) 风险占优。
// =============================================================================
export interface GameStagHuntHooks {
  onConclude?: (
    nashCells: Array<[number, number]>,
    payoffDominant: [number, number],
    riskDominant: [number, number],
  ) => void;
}

const ROW: ReadonlyArray<readonly number[]> = [
  [4, 0],
  [2, 2],
];
const COL: ReadonlyArray<readonly number[]> = [
  [4, 2],
  [0, 2],
];

export interface StagHuntResult {
  nashCells: Array<[number, number]>;
  payoffDominant: [number, number];
  riskDominant: [number, number];
}

export function gameStagHunt(hooks: GameStagHuntHooks = {}): StagHuntResult {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  // 收益占优：行+列最大
  let best = -Infinity;
  let payoffDominant: [number, number] = [0, 0];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const s = ROW[i]![j]! + COL[i]![j]!;
      if (s > best) {
        best = s;
        payoffDominant = [i, j];
      }
    }
  }
  // 风险占优：另一个纯纳什 (H,H)=(1,1)
  const riskDominant: [number, number] = [1, 1];
  hooks.onConclude?.(nashCells, payoffDominant, riskDominant);
  return { nashCells, payoffDominant, riskDominant };
}
