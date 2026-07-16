import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { singleNonDuplicate2, type SingleElem2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 1, 2, 3, 3, 4, 4, 8, 8];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `有序数组，仅一个单一元素`, en: `Sorted array, only one single element` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: SingleElem2Hooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      if (mid + 1 < n) roles[mid + 1] = 'compare';
      rec
        .begin({ zh: `比较 a[${mid}] 与 a[${mid + 1}]`, en: `Compare a[${mid}] vs a[${mid + 1}]` })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = singleNonDuplicate2(input, hooks);
  const idx = input.indexOf(r);
  rec
    .begin({ zh: `单一元素 = ${r}`, en: `Single element = ${r}` })
    .setArray(input, undefined, [{ index: idx, label: 'V' }])
    .commit();
  return rec.build();
}
