// =============================================================================
// 二维矩阵搜索 · 录制帧序列
// setGrid 展示矩阵，高亮探测格 (row,col)。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { search2d, type Search2DHooks } from './impl.ts';

export const DEFAULT_INPUT: number[][] = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];
export const DEFAULT_TARGET = 16;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[][] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const m = input.length;
  const n = m > 0 ? input[0]!.length : 0;
  let lo = 0;
  let hi = m * n - 1;

  const render = (note: { zh: string; en: string }, roles: Record<string, BarRole>): void => {
    const rows: Array<Array<string | number | undefined>> = input.map((r) => [...r]);
    const grid: Cell[][] = rec.gridFrom(rows, roles);
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([
        { label: 'target', value: String(target), role: 'final' },
        { label: '[lo,hi]', value: `[${lo}, ${hi}]`, role: 'compare' },
      ])
      .commit();
  };

  render({ zh: `矩阵中查找 ${target}`, en: `Search ${target} in matrix` }, {});

  const hooks: Search2DHooks = {
    onProbe: (curLo, curHi, _mid, row, col) => {
      lo = curLo;
      hi = curHi;
      const v = input[row]![col]!;
      const roles: Record<string, BarRole> = {};
      roles[`${row},${col}`] = 'pivot';
      render({ zh: `探测 [${row},${col}] = ${v}`, en: `Probe [${row},${col}] = ${v}` }, roles);
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (found, row, col) => {
      const roles: Record<string, BarRole> = {};
      if (found && row >= 0) roles[`${row},${col}`] = 'final';
      render(
        found
          ? { zh: `命中 [${row},${col}]`, en: `Found [${row},${col}]` }
          : { zh: '未找到', en: 'Not found' },
        roles,
      );
    },
  };

  search2d(input, target, hooks);
  return rec.build();
}
