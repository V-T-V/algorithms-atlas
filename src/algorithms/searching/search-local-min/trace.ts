import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findLocalMinimum, type LocalMinHooks } from './impl.ts';

export const DEFAULT_INPUT = [9, 6, 3, 14, 5, 7, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `互异数组找局部最小`, en: `Find local min in distinct array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: LocalMinHooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      if (mid - 1 >= 0) roles[mid - 1] = 'pivot';
      if (mid + 1 < n) roles[mid + 1] = 'pivot';
      rec
        .begin({ zh: `检查 a[${mid}]=${input[mid]}`, en: `Check a[${mid}]=${input[mid]}` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findLocalMinimum(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  if (r >= 0) roles2[r] = 'final';
  rec
    .begin({ zh: `局部最小下标 ${r}`, en: `Local min at ${r}` })
    .setArray(input, roles2, r >= 0 ? [{ index: r, label: 'V' }] : [])
    .commit();
  return rec.build();
}
