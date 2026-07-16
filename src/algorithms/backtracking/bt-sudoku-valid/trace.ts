// 验证数独 · 录制帧序列
import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btSudokuValid, type BtSudokuValidHooks } from './impl.ts';

export const DEFAULT_INPUT: string[][] = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];

export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const gridOf = (board: string[][]): Cell[][] =>
    board.map((row) => row.map((v) => ({ v, role: 'default' as BarRole })));

  rec
    .begin({ zh: '初始 9×9 数独', en: 'Initial 9x9 sudoku' })
    .setGrid(gridOf(input))
    .setAux([{ label: '目标', value: '检查行/列/宫不重复', role: 'pivot' }])
    .commit();

  const hooks: BtSudokuValidHooks = {
    onCell: (r, c, ch) => {
      const grid = gridOf(input);
      grid[r]![c]! = { v: ch, role: 'compare' };
      rec
        .begin({ zh: `检查 (${r},${c})="${ch}"`, en: `Check (${r},${c})="${ch}"` })
        .setGrid(grid)
        .commit();
    },
    onConflict: (r, c, ch, where) => {
      const grid = gridOf(input);
      grid[r]![c]! = { v: ch, role: 'warn' };
      rec
        .begin({
          zh: `冲突 (${r},${c})="${ch}" ${where}`,
          en: `Conflict (${r},${c})="${ch}" ${where}`,
        })
        .setGrid(grid)
        .setAux([{ label: '冲突', value: `${where} 重复 ${ch}`, role: 'warn' }])
        .commit();
    },
  };

  const ok = btSudokuValid(input, hooks);

  rec
    .begin({ zh: `完成：${ok ? '有效' : '无效'}`, en: `Done: ${ok ? 'valid' : 'invalid'}` })
    .setAux([{ label: '结果', value: String(ok), role: 'final' }])
    .commit();

  return rec.build();
}
