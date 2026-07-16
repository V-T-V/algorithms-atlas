import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findPeak2, type Peak2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `在数组中找峰值`, en: `Find a peak in array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: Peak2Hooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      if (mid + 1 < n) roles[mid + 1] = 'pivot';
      rec
        .begin({
          zh: `比较 a[${mid}]=${input[mid]} 与 a[${mid + 1}]=${input[mid + 1]}`,
          en: `Compare a[${mid}]=${input[mid]} vs a[${mid + 1}]=${input[mid + 1]}`,
        })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findPeak2(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  roles2[r] = 'final';
  rec
    .begin({ zh: `峰值下标 ${r}`, en: `Peak at ${r}` })
    .setArray(input, roles2, [{ index: r, label: 'V' }])
    .commit();
  return rec.build();
}
