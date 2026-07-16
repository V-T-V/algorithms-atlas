// =============================================================================
// 计数 DP（不同路径）· 录制帧序列
// 用二维 grid 展示 dp 表：行 i、列 j；当前填格 'compare'，右下角答案 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countDp, type GridPathInput } from './impl.ts';

/** 演示：4×4 网格，路径数 = C(6,3) = 20。 */
export const DEFAULT_INPUT: GridPathInput = { rows: 4, cols: 4 };

/** 录制演示帧序列。 */
export function buildTrace(input: GridPathInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { rows: m, cols: n } = input;

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(-1));
  let curI = -1;
  let curJ = -1;

  const renderGrid = (): Cell[][] => {
    const grid: Cell[][] = [];
    // 表头：列号
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    grid.push(header);
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [{ v: i, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (i === m - 1 && j === n - 1) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        row.push({ v: dp[i]![j]! < 0 ? '·' : dp[i]![j]!, role });
      }
      grid.push(row);
    }
    return grid;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([
        { label: '网格 / grid', value: `${m} × ${n}` },
        {
          label: '当前格 / cell',
          value: curI < 0 ? '—' : `(${curI}, ${curJ}) = ${dp[curI]![curJ]}`,
          role: 'compare',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `${m}×${n} 网格，求左上→右下路径数（只能向右/向下）`,
    en: `${m}×${n} grid, count top-left→bottom-right paths (right/down only)`,
  });

  const hooks = {
    onFillCell: (i: number, j: number, count: number) => {
      dp[i]![j] = count;
      curI = i;
      curJ = j;
      const from = i === 0 || j === 0 ? '边界（=1）' : `dp[${i - 1}][${j}] + dp[${i}][${j - 1}]`;
      const fromEn = i === 0 || j === 0 ? 'edge (=1)' : `dp[${i - 1}][${j}] + dp[${i}][${j - 1}]`;
      snapshot({
        zh: `dp[${i}][${j}] = ${count}（${from}）`,
        en: `dp[${i}][${j}] = ${count} (${fromEn})`,
      });
    },
    onDone: () => {},
  };

  const result = countDp(input, hooks);

  // 终态
  curI = -1;
  curJ = -1;
  rec
    .begin({
      zh: `完成：路径数 = ${result.count}`,
      en: `Done: number of paths = ${result.count}`,
    })
    .setGrid(renderGrid())
    .setAux([{ label: '路径数 / paths', value: String(result.count), role: 'final' }])
    .commit();

  return rec.build();
}
