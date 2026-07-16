import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinRotated2, type MinRotate2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 5, 6, 7, 0, 1, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  rec
    .begin({ zh: `旋转排序数组找最小值`, en: `Find min in rotated sorted array` })
    .setArray(input, undefined, [])
    .commit();
  const hooks: MinRotate2Hooks = {
    onCompare: (mid) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[mid] = 'compare';
      roles[n - 1] = 'pivot';
      rec
        .begin({
          zh: `比较 a[${mid}]=${input[mid]} 与 a[${n - 1}]=${input[n - 1]}`,
          en: `Compare a[${mid}]=${input[mid]} vs a[${n - 1}]=${input[n - 1]}`,
        })
        .setArray(input, roles, [{ index: mid, label: 'mid' }])
        .commit();
    },
  };
  const r = findMinRotated2(input, hooks);
  const roles2: BarRole[] = new Array(n).fill('default');
  roles2[r] = 'final';
  rec
    .begin({ zh: `最小值下标 ${r} = ${input[r]}`, en: `Min at ${r} = ${input[r]}` })
    .setArray(input, roles2, [{ index: r, label: 'V' }])
    .commit();
  return rec.build();
}
