// =============================================================================
// 最大矩形 · 录制帧序列
// 用 grid 展示 heights（悬挂高度）表：当前行 'compare'，最大候选 'final'。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxRectangle, type MaxRectangleHooks } from './impl.ts';

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

  const heights: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));
  let curRow = -1;
  let bestArea = 0;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: '行\\列', role: 'default' }];
    for (let j = 0; j < n; j++) header.push({ v: j, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < m; i++) {
      const row: Cell[] = [{ v: `#${i}`, role: 'pivot' }];
      for (let j = 0; j < n; j++) {
        let role: BarRole = 'default';
        if (curRow === i) role = 'compare';
        const raw = matrix[i]![j]!;
        const isOne = raw === 1 || raw === '1';
        row.push({ v: isOne ? `1·h${heights[i]![j]!}` : '0', role });
      }
      rows.push(row);
    }
    return rows;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGrid(renderGrid())
      .setAux([{ label: '当前最大面积 / best', value: String(bestArea), role: 'final' }])
      .commit();
  };

  snap({ zh: `${m}×${n} 矩阵，逐行悬挂法`, en: `${m}×${n} matrix, row-by-row histogram method` });

  const hooks: MaxRectangleHooks = {
    onUpdateHeights: (row, h) => {
      heights[row] = [...h];
      curRow = row;
      snap({
        zh: `第 ${row} 行高度更新：[${h.join(', ')}]`,
        en: `Row ${row} heights: [${h.join(', ')}]`,
      });
    },
    onCandidate: (row, lo, w, h, area) => {
      if (area >= bestArea) bestArea = area;
      snap({
        zh: `候选：列 [${lo}..${lo + w - 1}]，宽 ${w} × 高 ${h} = ${area}`,
        en: `Candidate: cols [${lo}..${lo + w - 1}], w=${w} × h=${h} = ${area}`,
      });
    },
  };

  const result = maxRectangle(matrix, hooks);

  curRow = -1;
  rec
    .begin({ zh: `最大全 1 矩形面积 = ${result}`, en: `Max all-1 rectangle area = ${result}` })
    .setGrid(renderGrid())
    .setAux([{ label: '最大面积 / area', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
