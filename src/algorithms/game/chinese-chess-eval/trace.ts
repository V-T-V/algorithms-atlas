// =============================================================================
// 中国象棋局面评估 · 录制帧序列
// 可视化：setGrid 渲染 10×9 棋盘；setAux 展示子力与位置分。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { evaluateBoard, initialBoard, type Board, type ChessEvalHooks } from './impl.ts';

export const DEFAULT_INPUT = 'initial';

const PIECE_LABEL: Record<string, string> = {
  K: '帅',
  A: '仕',
  E: '相',
  H: '马',
  R: '车',
  C: '炮',
  P: '兵',
  k: '将',
  a: '士',
  e: '象',
  h: '马',
  r: '车',
  c: '炮',
  p: '卒',
};

function renderBoard(board: Board, curR: number, curC: number, done: boolean): Cell[][] {
  return board.map((row, r) =>
    row.map((cell, c) => {
      const label = cell === '.' || cell === '' ? '' : (PIECE_LABEL[cell] ?? cell);
      let role: BarRole = 'default';
      if (done) role = 'final';
      else if (r === curR && c === curC) role = 'pivot';
      else if (cell !== '.' && cell !== '')
        role = cell >= 'A' && cell <= 'Z' ? 'compare' : 'frontier';
      return { v: label, role };
    }),
  );
}

/** 录制演示帧序列。 */
export function buildTrace(_input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const board = initialBoard();
  let lastResult = {
    score: 0,
    redMaterial: 0,
    blackMaterial: 0,
    redPositional: 0,
    blackPositional: 0,
  };

  rec
    .begin({
      zh: `评估中国象棋初始局面（红方视角）`,
      en: `Evaluate the initial Chinese chess position (Red's view)`,
    })
    .setGrid(renderBoard(board, -1, -1, false))
    .setAux([{ label: '说明', value: '子力 + 位置', role: 'default' }])
    .commit();

  const hooks: ChessEvalHooks = {
    onPiece: (r, c, piece, contribution) => {
      rec
        .begin({
          zh: `扫描 (${r},${c})=${PIECE_LABEL[piece] ?? piece}，贡献 ${contribution > 0 ? '+' : ''}${contribution}`,
          en: `Scan (${r},${c})=${piece}, contribution ${contribution > 0 ? '+' : ''}${contribution}`,
        })
        .setGrid(renderBoard(board, r, c, false))
        .setAux([
          { label: '当前子', value: `${piece} @ (${r},${c})`, role: 'pivot' },
          {
            label: '贡献',
            value: String(contribution),
            role: contribution >= 0 ? 'compare' : 'warn',
          },
        ])
        .commit();
    },
    onScore: (score) => {
      void score;
    },
  };

  const result = evaluateBoard(board, hooks);
  lastResult = result;

  rec
    .begin({
      zh: `完成：总分 ${result.score >= 0 ? '+' : ''}${result.score}（${
        result.score > 0 ? '红优' : result.score < 0 ? '黑优' : '均势'
      }）`,
      en: `Done: score ${result.score >= 0 ? '+' : ''}${result.score} (${
        result.score > 0 ? 'Red better' : result.score < 0 ? 'Black better' : 'balanced'
      })`,
    })
    .setGrid(renderBoard(board, -1, -1, true))
    .setAux([
      { label: '红子力', value: String(result.redMaterial), role: 'compare' },
      { label: '黑子力', value: String(result.blackMaterial), role: 'frontier' },
      { label: '红位置', value: String(result.redPositional), role: 'compare' },
      { label: '黑位置', value: String(result.blackPositional), role: 'frontier' },
      {
        label: '总分(红视角)',
        value: String(result.score),
        role: result.score >= 0 ? 'final' : ('warn' as BarRole),
      },
    ])
    .commit();

  void lastResult;
  return rec.build();
}
