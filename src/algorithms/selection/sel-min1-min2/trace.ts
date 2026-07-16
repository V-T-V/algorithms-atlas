import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { min1Min2 } from './impl.ts';

export const DEFAULT_INPUT = [7, 3, 9, 1, 8, 2, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let min1 = Infinity;
  let min2 = Infinity;
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
        { label: 'min1', value: min1 === Infinity ? '∞' : String(min1), role: 'final' as BarRole },
        { label: 'min2', value: min2 === Infinity ? '∞' : String(min2), role: 'pivot' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始 n=${input.length}`, en: `Init n=${input.length}` });

  min1Min2(input, {
    onUpdate: (m1, m2) => {
      min1 = m1;
      min2 = m2;
      processed++;
      snap({
        zh: `min1=${m1} min2=${m2 === Infinity ? '∞' : m2}`,
        en: `min1=${m1} min2=${m2 === Infinity ? '∞' : m2}`,
      });
    },
  });

  rec
    .begin({ zh: `完成：min1=${min1} min2=${min2}`, en: `Done: min1=${min1} min2=${min2}` })
    .setBars(
      input.map((v) => ({
        value: v,
        role: (v === min1 || v === min2 ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux([{ label: '结果', value: `min1=${min1}, min2=${min2}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
