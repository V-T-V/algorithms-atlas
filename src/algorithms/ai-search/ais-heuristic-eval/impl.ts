// 启发式评估函数 · 实现

export interface Feature {
  name: string;
  value: number; // 特征原始值（正=对当前玩家有利）
  weight: number;
}

export interface EvalHooks {
  onFeature?: (name: string, contribution: number) => void;
  onTotal?: (total: number) => void;
}

/**
 * 加权特征评估：score = Σ weight_i · value_i。
 */
export function evaluate(features: Feature[], hooks: EvalHooks = {}): number {
  let total = 0;
  for (const f of features) {
    const contrib = f.weight * f.value;
    total += contrib;
    hooks.onFeature?.(f.name, contrib);
  }
  hooks.onTotal?.(total);
  return total;
}

/**
 * 简化国际象棋评估：物质 + 机动性。
 * @param material 物质差（己方棋子价值总和 - 对方）
 * @param mobility 机动性差（己方合法走法数 - 对方）
 */
export function chessEval(material: number, mobility: number, hooks: EvalHooks = {}): number {
  return evaluate(
    [
      { name: '物质', value: material, weight: 1 },
      { name: '机动性', value: mobility, weight: 0.1 },
    ],
    hooks,
  );
}

/**
 * 井字棋评估：统计己方/对方在所有获胜线上的占有数。
 * @param lines 所有获胜线（每线 3 格）
 * @param board 3x3 棋盘：1=己, -1=敌, 0=空
 */
export function ticTacToeEval(board: number[][], hooks: EvalHooks = {}): number {
  const lines: ReadonlyArray<
    readonly [readonly [number, number], readonly [number, number], readonly [number, number]]
  > = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  let score = 0;
  for (const line of lines) {
    let mine = 0;
    let opp = 0;
    for (const [r, c] of line) {
      const v = board[r]![c]!;
      if (v === 1) mine++;
      else if (v === -1) opp++;
    }
    if (opp === 0) score += [1, 3, 100][mine]!; // 己方独占线
    if (mine === 0) score -= [1, 3, 100][opp]!;
  }
  hooks.onTotal?.(score);
  return score;
}
