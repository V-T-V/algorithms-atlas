// =============================================================================
// 排列硬币 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arrangeCoinsSimulate, type ArrangeCoinsHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const rows: Array<{ row: number; used: number }> = [];

  rec
    .begin({ zh: `${input} 枚硬币排阶梯`, en: `${input} coins in a staircase` })
    .setBars([])
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: ArrangeCoinsHooks = {
    onRow: (row, used) => rows.push({ row, used }),
  };

  const result = arrangeCoinsSimulate(input, hooks);

  // 用 bars 展示每行硬币数
  rec
    .begin({ zh: `填满 ${result} 行`, en: `Filled ${result} rows` })
    .setBars(
      rows.map((r) => ({ value: r.row, role: 'final' as BarRole, label: `r${r.row}=${r.row}` })),
    )
    .setAux(
      rows.map((r) => ({
        label: `行${r.row}`,
        value: `${r.used}/${input}`,
        role: 'compare' as BarRole,
      })),
    )
    .commit();

  rec
    .begin({ zh: `完整行数 = ${result}`, en: `Complete rows = ${result}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
