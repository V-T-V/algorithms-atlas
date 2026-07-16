// =============================================================================
// 不同路径 · 录制帧序列
// 用 grid 展示 dp 表：当前填的格标 'compare'，已填区域标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { uniquePaths, type UniquePathsHooks } from './impl.ts';

export const DEFAULT_INPUT = { m: 4, n: 5 };

/** 录制演示帧序列。 */
export function buildTrace(input: { m: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { m, n } = input;

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  let curI = -1;
  let curJ = -1;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (curI === i && curJ === j) role = 'compare';
        else if (dp[i]![j]! >= 0) role = 'final';
        row.push({ v: dp[i]![j]! < 0 ? '·' : dp[i]![j]!, role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({
    zh: `${m}×${n} 网格，左上→右下路径数`,
    en: `${m}×${n} grid, top-left → bottom-right path count`,
  });

  const hooks: UniquePathsHooks = {
    onFillCell: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({
        zh: `dp[${i}][${j}] = ${val}${i > 0 && j > 0 ? `（= dp[${i - 1}][${j}] + dp[${i}][${j - 1}]）` : '（首行/首列 = 1）'}`,
        en: `dp[${i}][${j}] = ${val}${i > 0 && j > 0 ? ` (= dp[${i - 1}][${j}] + dp[${i}][${j - 1}])` : ' (first row/col = 1)'}`,
      });
    },
  };

  const result = uniquePaths(m, n, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `路径总数 = ${result}`, en: `Total paths = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '路径数 / paths', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
