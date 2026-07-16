// =============================================================================
// 最大正方形 · 录制帧序列
// 用 grid 叠加展示：原矩阵格子为 '1' 的位置 + dp 表数值。
// 当前填的格标 'compare'，当前最大正方形的右下角格标 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maximalSquare, type MaximalSquareHooks } from './impl.ts';

export const DEFAULT_INPUT: (string | number)[][] = [
  ['1', '0', '1', '0', '0'],
  ['1', '0', '1', '1', '1'],
  ['1', '1', '1', '1', '1'],
  ['1', '0', '0', '1', '0'],
];

/** 录制演示帧序列。 */
export function buildTrace(input: (string | number)[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const matrix = input;
  const m = matrix.length;
  const n = m > 0 ? matrix[0]!.length : 0;

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let curI = -1;
  let curJ = -1;
  let bestCell: [number, number] | null = null;
  let best = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i\\j', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (bestCell && bestCell[0] === i && bestCell[1] === j) role = 'final';
        else if (curI === i && curJ === j) role = 'compare';
        const raw = matrix[i]![j]!;
        const isOne = raw === 1 || raw === '1';
        row.push({ v: isOne ? `1:${dp[i]![j]!}` : '0', role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: '当前最大边长 / best', value: String(best), role: 'final' }])
      .commit();
  };

  snap({ zh: `${m}×${n} 0/1 矩阵`, en: `${m}×${n} 0/1 matrix` });

  const hooks: MaximalSquareHooks = {
    onFillCell: (i, j, val) => {
      dp[i]![j] = val;
      curI = i;
      curJ = j;
      if (val >= best) {
        best = val;
        bestCell = [i, j];
      }
      snap({
        zh: `dp[${i}][${j}] = ${val}（左/上/左上取最小 +1）`,
        en: `dp[${i}][${j}] = ${val} (1 + min of left/up/up-left)`,
      });
    },
  };

  const result = maximalSquare(matrix, hooks);

  curI = -1;
  curJ = -1;
  rec
    .begin({
      zh: `最大正方形边长 = ${result}，面积 = ${result * result}`,
      en: `Max side = ${result}, area = ${result * result}`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '边长 / side', value: String(result), role: 'final' },
      { label: '面积 / area', value: String(result * result), role: 'final' },
    ])
    .commit();

  return rec.build();
}
