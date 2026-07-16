// 珠排序变种 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beadSort, type BeadSortHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `输入：${input.join(', ')}`, en: `Input: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .setAux([{ label: '步骤', value: '把每个数视作一列珠子', role: 'pivot' }])
    .commit();

  const hooks: BeadSortHooks = {
    onLay: (grid) => {
      rec
        .begin({
          zh: `铺设珠子矩阵（${grid.length} 行 × ${grid[0]!.length} 列）`,
          en: `Lay bead grid (${grid.length}×${grid[0]!.length})`,
        })
        .setGrid(
          grid.map((row) => row.map((v) => ({ v: v ? '●' : '·', role: 'default' as const }))),
        )
        .setAux([{ label: '矩阵', value: `${grid.length}×${grid[0]!.length}`, role: 'frontier' }])
        .commit();
    },
    onFall: (rowCounts) => {
      const roles: Record<number, BarRole> = {};
      rowCounts.forEach((_, i) => {
        roles[i] = 'swap';
      });
      rec
        .begin({
          zh: '重力下落后每行珠子数即排序结果',
          en: 'After gravity, row counts give the sorted result',
        })
        .setBars(rec.barsFrom(rowCounts, roles))
        .commit();
    },
  };

  const result = beadSort(input, hooks);

  rec
    .begin({ zh: `排序完成：${result.join(', ')}`, en: `Sorted: ${result.join(', ')}` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
