// =============================================================================
// N 皇后计数 · 录制帧序列
// 可视化：setGrid 渲染 N×N 棋盘，setAux 显示当前累计解数。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countNQueens, type NQueens2Hooks } from './impl.ts';

export const DEFAULT_INPUT = 6;

function renderBoard(n: number, board: readonly number[], solution: boolean): Cell[][] {
  const rolesFor: Record<string, BarRole> = {};
  for (let r = 0; r < n; r++) {
    const c = board[r]!;
    if (c >= 0) rolesFor[`${r},${c}`] = solution ? 'final' : 'pivot';
  }
  const rows: Array<Array<string | undefined>> = [];
  for (let r = 0; r < n; r++) {
    const row: Array<string | undefined> = [];
    for (let c = 0; c < n; c++) {
      row.push(board[r] === c ? 'Q' : undefined);
    }
    rows.push(row);
  }
  return rows.map((row, r) => row.map((v, c) => ({ v, role: rolesFor[`${r},${c}`] ?? 'default' })));
}

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const board: number[] = new Array<number>(n).fill(-1);
  let currentCount = 0;

  rec
    .begin({
      zh: `统计 ${n} 皇后解的总数（只计数，不列举）`,
      en: `Count total solutions of ${n}-Queens (count only)`,
    })
    .setGrid(renderBoard(n, board, false))
    .setAux([
      { label: '已找到解数', value: '0', role: 'default' },
      { label: '棋盘 N', value: String(n), role: 'default' },
    ])
    .commit();

  const hooks: NQueens2Hooks = {
    onPlace: (_r, _c, b) => {
      for (let i = 0; i < n; i++) board[i] = b[i] ?? -1;
      rec
        .begin({ zh: `放置皇后（深搜中）`, en: `Placing a queen (searching)` })
        .setGrid(renderBoard(n, board, false))
        .setAux([{ label: '已找到解数', value: String(currentCount), role: 'default' }])
        .commit();
    },
    onBacktrack: (_r, _c, b) => {
      for (let i = 0; i < n; i++) board[i] = b[i] ?? -1;
      rec
        .begin({ zh: `回溯撤销`, en: `Backtrack` })
        .setGrid(renderBoard(n, board, false))
        .setAux([{ label: '已找到解数', value: String(currentCount), role: 'default' }])
        .commit();
    },
    onSolution: (cnt, b) => {
      currentCount = cnt;
      for (let i = 0; i < n; i++) board[i] = b[i] ?? -1;
      rec
        .begin({ zh: `第 ${cnt} 个解！`, en: `Solution #${cnt}!` })
        .setGrid(renderBoard(n, board, true))
        .setAux([
          { label: '已找到解数', value: String(cnt), role: 'final' },
          { label: '棋盘 N', value: String(n), role: 'default' },
        ])
        .commit();
    },
    onDone: () => {
      void 0;
    },
  };

  // 为控制帧数，最多展示前若干解的放置过程；总数仍精确
  const total = countNQueens(n, hooks);

  rec
    .begin({
      zh: `完成：${n} 皇后共 ${total} 个解`,
      en: `Done: ${n}-Queens has ${total} solutions`,
    })
    .setGrid(renderBoard(n, board, true))
    .setAux([
      { label: '解的总数', value: String(total), role: 'final' },
      { label: '棋盘 N', value: String(n), role: 'default' },
    ])
    .commit();

  return rec.build();
}
