// =============================================================================
// 二维峰值查找 · 录制帧序列
// 用 setGrid 渲染矩阵，高亮当前列与列最大值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findPeak2D, type Peak2DHooks } from './impl.ts';

export const DEFAULT_INPUT: number[][] = [
  [10, 8, 10, 10],
  [14, 13, 12, 11],
  [15, 9, 11, 17],
  [16, 21, 19, 20],
];

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const m = input[0]!.length;
  let curCol = -1;
  let maxRow = -1;
  let peak: { row: number; col: number } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const grid = input.map((row, r) =>
      row.map((v, c) => {
        let role: BarRole = 'default';
        if (peak && r === peak.row && c === peak.col) role = 'final';
        else if (r === maxRow && c === curCol) role = 'pivot';
        else if (c === curCol) role = 'compare';
        return { v, role };
      }),
    );
    rec.begin(note).setGrid(grid).commit();
  };

  render({ zh: `在 ${n}×${m} 矩阵中找二维峰值`, en: `Find 2D peak in ${n}×${m} matrix` });

  const hooks: Peak2DHooks = {
    onColumn: (col, mr) => {
      curCol = col;
      maxRow = mr;
      render({
        zh: `取中间列 ${col}，列最大值在第 ${mr} 行 = ${input[mr]![col]}`,
        en: `Mid col ${col}, max at row ${mr} = ${input[mr]![col]}`,
      });
    },
    onBranch: (dir) => {
      const text =
        dir === 'left'
          ? '左邻居更大，向左递归'
          : dir === 'right'
            ? '右邻居更大，向右递归'
            : '当前即为峰值';
      render({ zh: text, en: text });
    },
    onDone: (p) => {
      peak = p;
      render({
        zh: `峰值位于 (${p.row}, ${p.col}) = ${input[p.row]![p.col]}`,
        en: `Peak at (${p.row}, ${p.col}) = ${input[p.row]![p.col]}`,
      });
    },
  };

  findPeak2D(
    input.map((r) => [...r]),
    hooks,
  );

  return rec.build();
}
