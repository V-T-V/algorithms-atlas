import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findFixedPoint, type FixedPointHooks } from './impl.ts';

export const DEFAULT_INPUT = [-10, -5, 0, 3, 7];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `升序互异数组找 arr[i]==i`, en: `Find arr[i]==i in sorted distinct array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: FixedPointHooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      rec
        .begin({
          zh: `比较 a[${mid}]=${input[mid]} 与 ${mid}`,
          en: `Compare a[${mid}]=${input[mid]} vs ${mid}`,
        })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findFixedPoint(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  if (r >= 0) roles2[r] = 'final';
  rec
    .begin(
      r >= 0
        ? { zh: `不动点下标 ${r}`, en: `Fixed point at ${r}` }
        : { zh: `无不动点`, en: `No fixed point` },
    )
    .setArray(input, roles2, r >= 0 ? [{ index: r, label: 'V' }] : [])
    .commit();
  return rec.build();
}
