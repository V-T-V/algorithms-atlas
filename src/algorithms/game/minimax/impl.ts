// =============================================================================
// 极小极大（Minimax）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 包含：博弈树求值 + 井字棋（Tic-Tac-Toe）具体博弈封装。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

/** 博弈树节点（用于纯树形 minimax）。叶子节点带 value。 */
export interface GameNode {
  /** 节点 id（唯一，便于追溯）。 */
  id: string;
  /** 叶子的效用值；内部节点由子节点聚合得到，初值留空。 */
  value?: number;
  /** 子节点。叶子节点为空数组。 */
  children: GameNode[];
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MinimaxHooks {
  /** 计算完某节点的效用值（含叶子直接返回）。给出节点 id、最终值、该层是否为 MAX。 */
  onEvaluate?: (nodeId: string, value: number, isMaxLayer: boolean) => void;
  /** MAX 层选出一个候选（取 max）。给出父节点 id、子节点 id、当前已知最大值。 */
  onMax?: (parentId: string, childId: string, currentMax: number) => void;
  /** MIN 层选出一个候选（取 min）。给出父节点 id、子节点 id、当前已知最小值。 */
  onMin?: (parentId: string, childId: string, currentMin: number) => void;
  /** alpha-beta 剪枝触发：该子树被剪掉。给出父节点 id、被剪的子节点 id。 */
  onPrune?: (parentId: string, prunedChildId: string) => void;
}

/** minimax 求值结果。 */
export interface MinimaxResult {
  /** 根节点效用值。 */
  value: number;
  /** 最优选择（根节点应走的子节点 id）。 */
  bestChildId: string | null;
  /** 被剪枝的次数。 */
  prunes: number;
}

/**
 * 极小极大算法（带 alpha-beta 剪枝）求博弈树根节点的效用值。
 *
 * - 根节点为 **MAX** 层（最大化玩家），其子节点为 MIN 层，依此交替。
 * - MAX 层返回子节点效用值的最大值；MIN 层返回最小值。
 * - 叶子节点直接返回其 `value`。
 *
 * alpha-beta 剪枝：维护区间 `[alpha, beta]`：
 * - MAX 层更新 `alpha = max(alpha, value)`；若 `alpha >= beta`，剩余兄弟可剪掉（β 剪枝）。
 * - MIN 层更新 `beta = min(beta, value)`；若 `beta <= alpha`，剩余兄弟可剪掉（α 剪枝）。
 *
 * @param root 博弈树根节点
 * @param hooks 可选的事件钩子
 * @param alpha 初始 alpha（内部用，调用方一般不传）
 * @param beta 初始 beta（内部用）
 * @param depth 当前深度（内部用）；根为 MAX 层（depth=0）
 */
export function minimax(
  root: GameNode,
  hooks: MinimaxHooks = {},
  options: { alphaBeta?: boolean } = {},
): MinimaxResult {
  const { alphaBeta = true } = options;
  let prunes = 0;
  let bestChildId: string | null = null;

  const recurse = (node: GameNode, alpha: number, beta: number, isMax: boolean): number => {
    // 叶子：直接返回效用
    if (node.children.length === 0) {
      const v = node.value ?? 0;
      hooks.onEvaluate?.(node.id, v, isMax);
      return v;
    }

    let value: number;
    let bestChild: string | null = null;
    if (isMax) {
      value = -Infinity;
      for (const child of node.children) {
        const cv = recurse(child, alpha, beta, false);
        if (cv > value) {
          value = cv;
          bestChild = child.id;
        }
        hooks.onMax?.(node.id, child.id, value);
        if (alphaBeta) {
          alpha = Math.max(alpha, value);
          if (alpha >= beta) {
            // β 剪枝：剩余兄弟剪掉
            const idx = node.children.indexOf(child);
            for (let k = idx + 1; k < node.children.length; k++) {
              prunes++;
              hooks.onPrune?.(node.id, node.children[k]!.id);
            }
            break;
          }
        }
      }
    } else {
      value = Infinity;
      for (const child of node.children) {
        const cv = recurse(child, alpha, beta, true);
        if (cv < value) {
          value = cv;
          bestChild = child.id;
        }
        hooks.onMin?.(node.id, child.id, value);
        if (alphaBeta) {
          beta = Math.min(beta, value);
          if (beta <= alpha) {
            const idx = node.children.indexOf(child);
            for (let k = idx + 1; k < node.children.length; k++) {
              prunes++;
              hooks.onPrune?.(node.id, node.children[k]!.id);
            }
            break;
          }
        }
      }
    }
    hooks.onEvaluate?.(node.id, value, isMax);
    // 把聚合值挂回（便于可视化）
    node.value = value;
    // 仅记录根的直接最优子
    if (node === root) bestChildId = bestChild;
    return value;
  };

  const value = recurse(root, -Infinity, Infinity, true);
  return { value, bestChildId, prunes };
}

// =============================================================================
// 井字棋（Tic-Tac-Toe）具体博弈封装
// =============================================================================

/** 棋盘格子：'X' / 'O' / null（空）。X 为最大化玩家（+1 胜），O 为最小化玩家（−1 胜）。 */
export type Cell3 = 'X' | 'O' | null;
/** 9 格棋盘。 */
export type Board3 = Cell3[];

/** 把 GameNode 子树转成可视化用的 TreeNode（含 value 文本）。 */
export function toTreeNode(node: GameNode): TreeNode {
  return {
    id: node.id,
    value: node.value !== undefined ? node.value : '',
    children: node.children.map(toTreeNode),
  };
}

/** 判断井字棋胜负：返回 'X' / 'O' / null（无人胜）。 */
export function winnerOf(board: Board3): 'X' | 'O' | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // 行
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // 列
    [0, 4, 8],
    [2, 4, 6], // 对角
  ];
  for (const [a, b, c] of lines) {
    if (board[a!] && board[a!] === board[b!] && board[a!] === board[c!]) {
      return board[a!] as 'X' | 'O';
    }
  }
  return null;
}

/** 棋盘是否已满（平局）。 */
export function isFull(board: Board3): boolean {
  return board.every((c) => c !== null);
}

/**
 * 井字棋的极小极大求值：给定棋盘，假设轮到 `player`，
 * 返回该局面对 X 玩家的效用（+1 X 胜 / −1 O 胜 / 0 平局或未终局且无强制结果）。
 *
 * 这里实现「最优效用」版本：X 试图最大化、O 试图最小化，
 * 终局返回 ±1 / 0，否则递归求所有可走步的极小极大值。
 *
 * @param board 当前棋盘
 * @param player 当前轮到谁
 * @param hooks 可选钩子
 * @returns 效用值与最佳落子位置
 */
export function ticTacToeMinimax(
  board: Board3,
  player: 'X' | 'O',
  hooks: { onEvaluate?: (b: Board3, score: number) => void } = {},
): { score: number; move: number | null } {
  const evaluate = (b: Board3, turn: 'X' | 'O'): number => {
    const w = winnerOf(b);
    if (w === 'X') return 1;
    if (w === 'O') return -1;
    if (isFull(b)) return 0;

    const empties: number[] = [];
    for (let i = 0; i < 9; i++) if (b[i] === null) empties.push(i);

    if (turn === 'X') {
      // MAX
      let best = -Infinity;
      for (const i of empties) {
        const nb = [...b];
        nb[i] = 'X';
        best = Math.max(best, evaluate(nb, 'O'));
      }
      hooks.onEvaluate?.(b, best);
      return best;
    } else {
      // MIN
      let best = Infinity;
      for (const i of empties) {
        const nb = [...b];
        nb[i] = 'O';
        best = Math.min(best, evaluate(nb, 'X'));
      }
      hooks.onEvaluate?.(b, best);
      return best;
    }
  };

  const w = winnerOf(board);
  if (w !== null || isFull(board)) {
    return { score: w === 'X' ? 1 : w === 'O' ? -1 : 0, move: null };
  }

  const empties: number[] = [];
  for (let i = 0; i < 9; i++) if (board[i] === null) empties.push(i);

  let bestScore = player === 'X' ? -Infinity : Infinity;
  let bestMove: number | null = null;
  for (const i of empties) {
    const nb = [...board];
    nb[i] = player;
    const s = evaluate(nb, player === 'X' ? 'O' : 'X');
    if (player === 'X' ? s > bestScore : s < bestScore) {
      bestScore = s;
      bestMove = i;
    }
  }
  return { score: bestScore, move: bestMove };
}
