// =============================================================================
// Negamax 搜索 · 录制帧序列
// 用 setTree 展示博弈树，节点 value 显示棋盘快照与 negamax 值。
// =============================================================================

import type { BarRole, Cell, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { negamax, hasWon, isFull, type NegamaxHooks, type TttNode } from './impl.ts';

/** 一个非终局但 MAX 必胜的局面：X 已有两子威胁，O 难以全部封堵。 */
export const DEFAULT_BOARD: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 0];
export const DEFAULT_PLAYER: 1 | 2 = 1;

let nodeIdCounter = 0;
function nextId(): string {
  nodeIdCounter += 1;
  return `n${nodeIdCounter}`;
}

/** 把 9 格棋盘渲染成 3×3 Cell 网格的辅助小卡片（放进 aux 不太合适，这里放 array2d）。 */
function boardToGrid(board: number[], highlight: Set<number>): Cell[][] {
  const sym = (v: number): string => (v === 1 ? 'X' : v === 2 ? 'O' : '·');
  return [0, 1, 2].map((r) =>
    [0, 1, 2].map((c) => {
      const idx = r * 3 + c;
      return {
        v: sym(board[idx]!),
        role: (highlight.has(idx!) ? 'compare' : 'default') as BarRole,
      };
    }),
  );
}

/** 把内部 TttNode 树转成可视化 TreeNode。 */
function toViz(node: TttNode, highlight: Set<TttNode>, evaluated: Set<TttNode>): TreeNode {
  const val = node.value !== undefined ? node.value.toFixed(0) : '?';
  const term = hasWon(node.board, 1) || hasWon(node.board, 2) || isFull(node.board);
  let role: BarRole = 'default';
  if (highlight.has(node)) role = 'compare';
  else if (evaluated.has(node)) role = 'final';
  else if (term) role = 'sorted';
  else if (node.value !== undefined) role = 'frontier';
  const compact = node.board.map((c) => (c === 1 ? 'X' : c === 2 ? 'O' : '.')).join('');
  return {
    id: nextId(),
    value: `${compact}\n${node.player === 1 ? 'X' : 'O'} v=${val}`,
    role,
    children: node.children?.map((c) => toViz(c, highlight, evaluated)),
  };
}

export function buildTrace(
  board: number[] = DEFAULT_BOARD,
  player: 1 | 2 = DEFAULT_PLAYER,
): Frame[] {
  const rec = new TraceRecorder();
  nodeIdCounter = 0;

  const root: TttNode = { board, player };
  const highlight = new Set<TttNode>();
  const evaluated = new Set<TttNode>();
  let stepCounter = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    nodeIdCounter = 0;
    rec
      .begin(note)
      .setTree(toViz(root, highlight, evaluated))
      .setGrid(boardToGrid(root.board, new Set()))
      .setAux([
        { label: '步数', value: `${stepCounter}`, role: 'pivot' },
        {
          label: '根值',
          value: root.value !== undefined ? String(root.value) : '计算中',
          role: 'frontier',
        },
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `初始棋盘，${player === 1 ? 'X' : 'O'} 先手，开始 negamax 搜索`,
    en: `Initial board, ${player === 1 ? 'X' : 'O'} to move, start negamax search`,
  });

  const hooks: NegamaxHooks = {
    onEvaluate: (node, score, depth) => {
      stepCounter += 1;
      evaluated.add(node);
      highlight.add(node);
      snapshot({
        zh: `估值叶子（深度 ${depth}）= ${score}`,
        en: `Evaluate leaf (depth ${depth}) = ${score}`,
      });
    },
    onReturn: (node, value, _depth) => {
      stepCounter += 1;
      highlight.add(node);
      snapshot({
        zh: `内部节点返回 v=${value}（${node.player === 1 ? 'X' : 'O'} 视角）`,
        en: `Internal node returns v=${value} (${node.player === 1 ? 'X' : 'O'} POV)`,
      });
    },
  };

  negamax(root, 9 - board.filter((c) => c !== 0).length, 1, hooks);

  nodeIdCounter = 0;
  const verdict =
    (root.value ?? 0) > 0
      ? `${player === 1 ? 'X' : 'O'} 必胜`
      : (root.value ?? 0) < 0
        ? `${player === 1 ? 'X' : 'O'} 必败`
        : '必平';
  rec
    .begin({
      zh: `完成：根值 = ${root.value}（${verdict}）`,
      en: `Done: root value = ${root.value} (${verdict})`,
    })
    .setTree(toViz(root, new Set(), evaluated))
    .setGrid(boardToGrid(root.board, new Set()))
    .setAux([
      { label: '根值', value: String(root.value), role: 'final' },
      { label: '结论', value: verdict, role: 'final' },
    ])
    .commit();

  return rec.build();
}
