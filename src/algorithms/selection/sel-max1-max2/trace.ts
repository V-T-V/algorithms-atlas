import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { max1Max2 } from './impl.ts';

export const DEFAULT_INPUT = [7, 3, 9, 1, 8, 2, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let max1 = -Infinity;
  let max2 = -Infinity;
  let processed = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        input.map((v, i) => ({
          value: v,
          role: (i < processed ? 'sorted' : 'default') as BarRole,
          label: String(v),
        })),
      )
      .setAux([
        { label: 'max1', value: max1 === -Infinity ? '-∞' : String(max1), role: 'final' as const },
        { label: 'max2', value: max2 === -Infinity ? '-∞' : String(max2), role: 'pivot' as const },
      ])
      .commit();
  };

  snap({ zh: `初始 n=${input.length}`, en: `Init n=${input.length}` });

  max1Max2(input, {
    onUpdate: (m1, m2) => {
      max1 = m1;
      max2 = m2;
      processed++;
      snap({
        zh: `max1=${m1} max2=${m2 === -Infinity ? '-∞' : m2}`,
        en: `max1=${m1} max2=${m2 === -Infinity ? '-∞' : m2}`,
      });
    },
  });

  rec
    .begin({ zh: `完成：max1=${max1} max2=${max2}`, en: `Done: max1=${max1} max2=${max2}` })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (v === max1 || v === max2 ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([{ label: '结果', value: `max1=${max1}, max2=${max2}`, role: 'final' as const }])
    .commit();
  return rec.build();
}
