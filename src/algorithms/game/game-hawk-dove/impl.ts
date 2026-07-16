// =============================================================================
// 鹰鸽博弈 · 纯算法实现
// 对称博弈：资源价值 V，受伤代价 C（默认 V<C）。
// 行=列 收益矩阵（鹰,鸽）：
//        H            D
//   H  (V-C)/2        V
//   D    0           V/2
// 两个不对称纯纳什 (H,D) (D,H)；ESS 鹰频率 = V/C。
// =============================================================================
export interface GameHawkDoveHooks {
  onConclude?: (nashCells: Array<[number, number]>, essHawkFreq: number) => void;
}

export interface HawkDoveResult {
  nashCells: Array<[number, number]>;
  essHawkFreq: number;
}

export function gameHawkDove(V = 50, C = 100, hooks: GameHawkDoveHooks = {}): HawkDoveResult {
  const HH = (V - C) / 2;
  const HD = V;
  const DH = 0;
  const DD = V / 2;
  const ROW: ReadonlyArray<readonly number[]> = [
    [HH, HD],
    [DH, DD],
  ];

  // 对称博弈，列收益 = ROW^T
  const nashCells: Array<[number, number]> = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const rb = ROW[0]![j]! >= ROW[1]![j]! ? 0 : 1;
      // 对称博弈：列收益矩阵 = ROW 的转置，COL[i][j] = ROW[j][i]
      // 列玩家固定行 i 时比较选 0(Hawk) 还是 1(Dove)：col0=ROW[0][i], col1=ROW[1][i]
      const col0 = ROW[0]![i]!;
      const col1 = ROW[1]![i]!;
      const cb = col0 >= col1 ? 0 : 1;
      if (rb === i && cb === j) nashCells.push([i, j]);
    }
  }
  // ESS：鹰频率 p 使鸽无差异，得 p = V/C
  const essHawkFreq = V / C;
  hooks.onConclude?.(nashCells, essHawkFreq);
  return { nashCells, essHawkFreq };
}
