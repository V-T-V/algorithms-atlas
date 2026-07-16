// =============================================================================
// 协调博弈 · 纯算法实现
// 行=列 收益（对称）：
//        A    B
//   A    2    0
//   B    0    1
// 两个纯纳什 (A,A) (B,B)，(A,A) 帕累托占优。
// =============================================================================
export interface GameCoordinationHooks {
  onConclude?: (nashCells: Array<[number, number]>, paretoDominant: [number, number]) => void;
}

const ROW: ReadonlyArray<readonly number[]> = [
  [2, 0],
  [0, 1],
];
const COL: ReadonlyArray<readonly number[]> = [
  [2, 0],
  [0, 1],
];

export interface CoordinationResult {
  nashCells: Array<[number, number]>;
  paretoDominant: [number, number];
}

export function gameCoordination(hooks: GameCoordinationHooks = {}): CoordinationResult {
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      const cb = COL[i]![0]! >= COL[i]![1]! ? 0 : 1;
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  // 帕累托占优：在纳什中找两者收益都更大的
  let paretoDominant: [number, number] = nashCells[0] ?? [0, 0];
  for (const [i, j] of nashCells) {
    const cur = paretoDominant;
    if (ROW[i]![j]! >= ROW[cur[0]]![cur[1]]! && COL[i]![j]! >= COL[cur[0]]![cur[1]]!) {
      paretoDominant = [i, j];
    }
  }
  hooks.onConclude?.(nashCells, paretoDominant);
  return { nashCells, paretoDominant };
}
