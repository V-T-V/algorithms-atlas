// 相关均衡 · 实现
// 验证：给定联合分布 P[a][b]（2x2），检查每个玩家对推荐无偏离动机。
export interface CeHooks {
  onCheck?: (
    player: 'row' | 'col',
    recommended: number,
    recPayoff: number,
    bestDeviation: number,
    stable: boolean,
  ) => void;
  onConclude?: (isCorrelated: boolean) => void;
}
const ROW: ReadonlyArray<readonly number[]> = [
  [3, 0],
  [5, 1],
];
const COL: ReadonlyArray<readonly number[]> = [
  [3, 5],
  [0, 1],
];
export function correlatedEquilibrium(
  P: ReadonlyArray<readonly number[]>,
  hooks: CeHooks = {},
): boolean {
  let ok = true;
  for (let a = 0; a < 2; a++) {
    let pRec = 0,
      pDev = 0;
    for (let b = 0; b < 2; b++) {
      pRec += P[a]![b]! * ROW[a]![b]!;
      pDev += P[a]![b]! * ROW[1 - a]![b]!;
    }
    const stable = pRec >= pDev - 1e-9;
    hooks.onCheck?.('row', a, pRec, pDev, stable);
    if (!stable) ok = false;
  }
  for (let b = 0; b < 2; b++) {
    let pRec = 0,
      pDev = 0;
    for (let a = 0; a < 2; a++) {
      pRec += P[a]![b]! * COL[a]![b]!;
      pDev += P[a]![b]! * COL[a]![1 - b]!;
    }
    const stable = pRec >= pDev - 1e-9;
    hooks.onCheck?.('col', b, pRec, pDev, stable);
    if (!stable) ok = false;
  }
  hooks.onConclude?.(ok);
  return ok;
}
