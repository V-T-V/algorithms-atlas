// =============================================================================
// ST 表 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SparseTable2 } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9, 2, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const st = new SparseTable2(input);

  rec
    .begin({ zh: 'ST 表构建完成', en: 'Sparse table built' })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .commit();

  for (const [l, r] of [
    [0, 3],
    [2, 6],
    [0, 7],
  ] as const) {
    const m = st.query(l, r);
    rec
      .begin({ zh: `区间 [${l},${r}] 最大 = ${m}`, en: `Range [${l},${r}] max = ${m}` })
      .setBars(
        input.map((x, i) => ({
          value: x,
          role: i >= l && i <= r ? 'compare' : 'default',
        })),
      )
      .setAux([{ label: `[${l},${r}]`, value: String(m), role: 'pivot' }])
      .commit();
  }

  rec
    .begin({ zh: '查询结束', en: 'Done' })
    .setBars(input.map((x) => ({ value: x, role: 'final' })))
    .commit();

  return rec.build();
}
