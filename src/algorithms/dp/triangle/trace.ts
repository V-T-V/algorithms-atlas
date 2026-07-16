// =============================================================================
// 三角形最小路径 · 录制帧序列
// 用 grid（每行长度递增）展示 dp 表；当前格 'compare'，回溯最优路径 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { triangle, type TriangleHooks } from './impl.ts';

export const DEFAULT_INPUT: number[][] = [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]];

/** 录制演示帧序列。 */
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const tri = input;
  const n = tri.length;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(0));
  let curI = -1;
  let curJ = -1;
  const pathSet = new Set<string>();

  const renderGrid = (): Cell[][] => {
    const rows: Cell[][] = [];
    const maxW = n;
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < maxW; j++) header.push({ v: j, role: 'pivot' });
    rows.push(header);
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let j = 0; j <= i; j++) {
        let role: BarRole = 'default';
        if (pathSet.has(`${i},${j}`)) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        const v = dp[i]![j];
        row.push({ v: v === undefined ? `${tri[i]![j]!}` : `${tri[i]![j]!}/${v}`, role });
      }
      for (let j = i + 1; j < maxW; j++) row.push({ v: ' ', role: 'default' });
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec.begin(note).setGrid(renderGrid()).commit();
  };

  snap({ zh: `${n} 行三角形，顶到底最小路径和`, en: `${n}-row triangle, top→bottom min sum` });

  const hooks: TriangleHooks = {
    onFillCell: (i, j, val) => {
      if (!dp[i]) dp[i] = new Array<number>(i + 1).fill(0);
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      snap({
        zh: `dp[${i}][${j}] = ${val}（val=${tri[i]![j]!} + min(左上,正上)）`,
        en: `dp[${i}][${j}] = ${val} (val=${tri[i]![j]!} + min(up-left,up))`,
      });
    },
    onPath: (i, j) => {
      pathSet.add(`${i},${j}`);
      curI = -1;
      curJ = -1;
      snap({ zh: `路径回溯经过 (${i},${j})`, en: `Path backtracks through (${i},${j})` });
    },
  };

  const result = triangle(tri, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({ zh: `最小路径和 = ${result}`, en: `Min path sum = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最小和 / sum', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
