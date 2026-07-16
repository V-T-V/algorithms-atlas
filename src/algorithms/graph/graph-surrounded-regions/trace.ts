// =============================================================================
// 被围绕的区域 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveSurrounded, type SurroundedHooks } from './impl.ts';

export const DEFAULT_BOARD = () => [
  ['X', 'X', 'X', 'X'],
  ['X', 'O', 'O', 'X'],
  ['X', 'X', 'O', 'X'],
  ['X', 'O', 'X', 'X'],
];

export function buildTrace(board: string[][] = DEFAULT_BOARD()): Frame[] {
  const rec = new TraceRecorder();
  const m = board.length;
  const n = m > 0 ? board[0]!.length : 0;
  let curR = -1;
  let curC = -1;

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    for (let r = 0; r < m; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < n; c++) {
        let role: BarRole = 'default';
        if (r === curR && c === curC) role = 'compare';
        else if (board[r]![c] === 'X') role = 'warn';
        else role = 'frontier';
        row.push({ v: board[r]![c], role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${m}×${n} 棋盘`, en: `${m}×${n} board` });

  const hooks: SurroundedHooks = {
    onMark: (r, c) => {
      curR = r;
      curC = c;
      snap({ zh: `标记边界连通 (${r},${c})`, en: `Mark border-connected (${r},${c})` });
    },
    onFlip: (r, c) => {
      curR = r;
      curC = c;
      snap({ zh: `翻转 (${r},${c}) 为 X`, en: `Flip (${r},${c}) to X` });
    },
    onResult: () => {
      curR = -1;
      curC = -1;
      snap({ zh: '完成', en: 'Done' });
    },
  };

  solveSurrounded(board, hooks);

  rec.begin({ zh: '已翻转被围绕的 O', en: 'Surrounded O flipped' }).setGrid(renderGrid()).commit();

  return rec.build();
}
