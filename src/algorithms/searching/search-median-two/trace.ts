import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { medianOfTwoSorted, type MedianTwoHooks } from './impl.ts';

export const DEFAULT_INPUT_A = [1, 3];
export const DEFAULT_INPUT_B = [2];

export function buildTrace(a: number[] = DEFAULT_INPUT_A, b: number[] = DEFAULT_INPUT_B): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `A=[${a.join(',')}] B=[${b.join(',')}]`,
      en: `A=[${a.join(',')}] B=[${b.join(',')}]`,
    })
    .setAux([
      { label: 'A', value: `[${a.join(',')}]`, role: 'pivot' as BarRole },
      { label: 'B', value: `[${b.join(',')}]`, role: 'frontier' as BarRole },
    ])
    .commit();
  const hooks: MedianTwoHooks = {
    onPartition: (i, j) => {
      rec
        .begin({ zh: `切分 i=${i}, j=${j}`, en: `Partition i=${i}, j=${j}` })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' as BarRole },
          { label: 'j', value: String(j), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };
  const r = medianOfTwoSorted(a, b, hooks);
  rec
    .begin({ zh: `中位数 = ${r}`, en: `Median = ${r}` })
    .setAux([{ label: 'median', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
