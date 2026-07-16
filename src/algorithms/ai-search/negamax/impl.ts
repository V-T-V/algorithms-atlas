// =============================================================================
// Negamax 搜索 · 纯算法实现
// 以 Tic-Tac-Toe（井字棋）为演示领域。
// 棋盘表示：长度 9 的数组，0=空，1=X（先手），2=O（后手）。
// 站在「当前要走的玩家」视角计分：+1 胜，-1 负，0 平。
// =============================================================================

/** 胜利的三连线索引。 */
export const LINES: ReadonlyArray<readonly number[]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // 行
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // 列
  [0, 4, 8],
  [2, 4, 6], // 对角
];

/** 博弈树节点。 */
export interface TttNode {
  board: number[]; // 长度 9
  player: 1 | 2; // 当前要走的玩家
  children?: TttNode[];
  /** 站在 player 视角的分数。 */
  value?: number;
}

/** 判断某玩家是否已胜。 */
export function hasWon(board: number[], player: number): boolean {
  for (const line of LINES) {
    if (board[line[0]!] === player && board[line[1]!] === player && board[line[2]!] === player) {
      return true;
    }
  }
  return false;
}

/** 棋盘已满（无空格）。 */
export function isFull(board: number[]): boolean {
  return board.every((c) => c !== 0);
}

/** 列出所有空格索引。 */
export function emptyCells(board: number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 0) out.push(i);
  }
  return out;
}

export interface NegamaxHooks {
  /** 叶子节点估值完成。 */
  onEvaluate?: (node: TttNode, score: number, depth: number) => void;
  /** 内部节点递归完成。 */
  onReturn?: (node: TttNode, value: number, depth: number) => void;
}

/**
 * Negamax 主函数。返回「站在 node.player 视角」的分数。
 *
 * @param node 当前节点
 * @param depth 剩余深度（用于提前截断，TTT 完整搜索不需要但保留接口）
 * @param color 当前玩家标识（1 或 -1，仅用于颜色统一约定，本实现忽略）
 * @param hooks 可选钩子
 */
export function negamax(
  node: TttNode,
  depth: number,
  color: number = 1,
  hooks: NegamaxHooks = {},
): number {
  const opponent: 1 | 2 = node.player === 1 ? 2 : 1;

  // 终局检测：对手刚走完，所以先看对手是否赢了
  if (hasWon(node.board, opponent)) {
    // 当前 player 输
    node.value = -1;
    hooks.onEvaluate?.(node, -1, depth);
    return -1;
  }
  if (isFull(node.board)) {
    node.value = 0;
    hooks.onEvaluate?.(node, 0, depth);
    return 0;
  }
  if (depth === 0) {
    // 非终局但深度耗尽：平分估值
    node.value = 0;
    hooks.onEvaluate?.(node, 0, depth);
    return 0;
  }

  // 生成后继
  const cells = emptyCells(node.board);
  const children: TttNode[] = cells.map((cell) => {
    const next = [...node.board];
    next[cell] = node.player;
    return { board: next, player: opponent };
  });
  node.children = children;

  let best = -Infinity;
  for (const child of children) {
    const v = -negamax(child, depth - 1, -color, hooks);
    if (v > best) best = v;
  }
  // 归一化 -0 → +0（避免对 -1*0 产生 Object.is 视 -0 ≠ 0 的测试歧义）
  best = best === 0 ? 0 : best;
  node.value = best;
  hooks.onReturn?.(node, best, depth);
  return best;
}

/** 在根上做一次完整搜索，返回根值与构建的树。 */
export function solve(board: number[], player: 1 | 2): { root: TttNode; value: number } {
  const root: TttNode = { board, player };
  // TTT 最多 9 步，给足够深度
  const value = negamax(root, 9 - board.filter((c) => c !== 0).length, 1);
  return { root, value };
}
