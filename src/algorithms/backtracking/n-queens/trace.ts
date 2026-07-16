// =============================================================================
// N 皇后 · 录制帧序列
// 通过 nQueens 的钩子，把回溯执行过程录成 Frame[]。
// 可视化：setGrid 渲染 N×N 棋盘，Cell.v='Q' 表示皇后，role 标语义色。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nQueens, type NQueensHooks } from './impl.ts';

export const DEFAULT_INPUT = 4;

/** 一次回溯过程中被攻击（不安全）的格子，临时高亮为 warn。 */
interface Pending {
  type: 'place' | 'backtrack';
  row: number;
  col: number;
}

/** 依据 board 渲染整张棋盘快照。 */
function renderBoard(
  n: number,
  board: readonly number[],
  pending: Pending | null,
  solution: number[] | null,
): Cell[][] {
  const rolesFor: Record<string, BarRole> = {};
  if (solution) {
    // 找到解：所有皇后标 final
    for (let r = 0; r < n; r++) {
      const c = solution[r]!;
      rolesFor[`${r},${c}`] = 'final';
    }
  } else {
    // 已放置皇后标 pivot；当前操作的格子按 pending 覆盖
    for (let r = 0; r < n; r++) {
      const c = board[r]!;
      if (c >= 0) rolesFor[`${r},${c}`] = 'pivot';
    }
    if (pending) {
      rolesFor[`${pending.row},${pending.col}`] = pending.type === 'place' ? 'pivot' : 'warn';
    }
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
  // 同步 impl 内部 board 状态，供渲染用（每次钩子触发时刷新）
  // 由于 impl 在 place 之后立即触发 onPlace，我们用 board[onPlace.row]=col 维护
  let pending: Pending | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderBoard(n, board, pending, null))
      .commit();
    pending = null;
  };

  rec
    .begin({
      zh: `开始求解 ${n} 皇后：在 ${n}×${n} 棋盘上放 ${n} 个互不攻击的皇后`,
      en: `Solve ${n}-Queens: place ${n} non-attacking queens on a ${n}×${n} board`,
    })
    .setGrid(renderBoard(n, board, null, null))
    .commit();

  const hooks: NQueensHooks = {
    onPlace: (row, col) => {
      board[row] = col;
      pending = { type: 'place', row, col };
      snapshot({
        zh: `第 ${row} 行放置皇后于第 ${col} 列`,
        en: `Row ${row}: place queen at column ${col}`,
      });
    },
    onBacktrack: (row, col) => {
      board[row] = -1; // 已被 impl 撤销，同步
      pending = { type: 'backtrack', row, col };
      snapshot({
        zh: `第 ${row} 行第 ${col} 列走不通，回溯撤销`,
        en: `Row ${row} col ${col} dead-ends; backtrack`,
      });
    },
    onSolution: (solution) => {
      rec
        .begin({
          zh: `找到一个解！共 ${solution.length} 个皇后互不攻击`,
          en: `Solution found! ${solution.length} queens placed without conflict`,
        })
        .setGrid(renderBoard(n, solution, null, solution))
        .commit();
    },
  };

  nQueens(n, hooks, { maxSolutions: 2 });

  // 终态：复显最后一个解
  const all = nQueens(n, {}, {});
  const last = all[all.length - 1];
  if (last) {
    rec
      .begin({ zh: '完成', en: 'Done' })
      .setGrid(renderBoard(n, last, null, last))
      .commit();
  } else {
    rec
      .begin({ zh: '完成（无解）', en: 'Done (no solution)' })
      .setGrid(renderBoard(n, board, null, null))
      .commit();
  }

  return rec.build();
}
