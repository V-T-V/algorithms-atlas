// =============================================================================
// 重力排序 · 录制帧序列
// 用 setGrid 渲染珠子矩阵（行=元素，列=珠位），逐列下落后重建。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gravitySort, type GravitySortHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 3, 1, 4, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  let max = 0;
  for (const v of input) if (v > max) max = v;

  rec
    .begin({
      zh: `输入：[${input.join(', ')}]，最大值 ${max}`,
      en: `Input: [${input.join(', ')}], max = ${max}`,
    })
    .setBars(rec.barsFrom(input))
    .commit();

  const renderGrid = (matrix: number[][], note: { zh: string; en: string }): void => {
    const grid = matrix.map((row) =>
      row.map((bit) => ({
        v: bit === 1 ? '●' : '·',
        role: (bit === 1 ? 'frontier' : 'default') as BarRole,
      })),
    );
    rec.begin(note).setGrid(grid).commit();
  };

  const hooks: GravitySortHooks = {
    onMatrix: (matrix) => {
      renderGrid(matrix, { zh: '构建珠子矩阵（行=元素，列=珠位）', en: 'Build bead matrix' });
    },
    onColumns: (colCounts) => {
      rec
        .begin({
          zh: `重力下落：各列珠子数 [${colCounts.join(', ')}]`,
          en: `Gravity: column counts [${colCounts.join(', ')}]`,
        })
        .setAux(
          colCounts.map((c, j) => ({
            label: `列${j}`,
            value: String(c),
            role: 'pivot' as BarRole,
          })),
        )
        .commit();
    },
    onRebuilt: (sorted) => {
      rec
        .begin({ zh: '重建排序结果', en: 'Rebuild sorted result' })
        .setBars(sorted.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit();
    },
  };

  gravitySort(input, hooks);

  void n;
  return rec.build();
}
