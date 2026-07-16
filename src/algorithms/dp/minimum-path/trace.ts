// =============================================================================
// 最小路径和 · 录制帧序列
// 用 grid 展示 dp 表：当前填的格标 'compare'，回溯出的最优路径标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minimumPath, type MinPathHooks } from './impl.ts';

export const DEFAULT_INPUT: number[][] = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const grid = input;
  const m = grid.length;
  const n = m > 0 ? grid[0]!.length : 0;

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  let curI = -1;
  let curJ = -1;
  const pathSet = new Set<string>();

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (pathSet.has(`${i},${j}`)) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        const v = dp[i]![j]!;
        row.push({ v: v < 0 ? `${grid[i]![j]!}` : `${grid[i]![j]!}/${v}`, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({
    zh: `${m}×${n} 网格，左上→右下最小路径和`,
    en: `${m}×${n} grid, top-left → bottom-right min sum`,
  });

  const hooks: MinPathHooks = {
    onFillCell: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({
        zh: `dp[${i}][${j}] = ${val}（grid=${grid[i]![j]!} + min(上,左)）`,
        en: `dp[${i}][${j}] = ${val} (grid=${grid[i]![j]!} + min(up,left))`,
      });
    },
    onPath: (i, j) => {
      pathSet.add(`${i},${j}`);
      curI = -1;
      curJ = -1;
      snap({ zh: `路径回溯经过 (${i},${j})`, en: `Path backtracks through (${i},${j})` });
    },
  };

  const result = minimumPath(grid, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `最小路径和 = ${result}`, en: `Min path sum = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最小和 / sum', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
