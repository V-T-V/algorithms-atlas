// =============================================================================
// 统计出现次数 · 录制帧序列
// setArray + lo/mid/hi 指针：两次二分（左界、右界）夹出等于 target 的区间。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countOccurrence, type CountOccurrenceHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 2, 3, 3, 4, 5, 5, 5];
export const DEFAULT_TARGET = 2;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let lo = 0;
  let hi = n - 1;
  let mid = -1;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = lo; k <= hi && k >= 0; k++) roles[k] = 'frontier';
    if (mid >= lo && mid <= hi && mid >= 0) roles[mid] = 'pivot';
    return roles;
  };

  const snap = (
    note: { zh: string; en: string },
    pointers: Array<{ index: number; label: string }>,
  ): void => {
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snap({ zh: `统计 ${target} 出现次数`, en: `Count occurrences of ${target}` }, [
    { index: lo, label: 'lo' },
    { index: hi, label: 'hi' },
  ]);

  const hooks: CountOccurrenceHooks = {
    onProbe: (curLo, curHi, curMid) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap(
        {
          zh: `中点 mid=${mid}，a[${mid}]=${values[mid]} 与 ${target} 比较`,
          en: `Mid=${mid}, a[${mid}]=${values[mid]} vs ${target}`,
        },
        [
          { index: lo, label: 'lo' },
          { index: mid, label: 'mid' },
          { index: hi, label: 'hi' },
        ],
      );
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
      mid = -1;
    },
    onDone: (count, left, right) => {
      const roles: BarRole[] = new Array(n).fill('default');
      for (let k = left; k <= right && k >= 0; k++) roles[k] = 'final';
      rec
        .begin({
          zh: `共 ${count} 个，区间 [${left}, ${right}]`,
          en: `${count} occurrences [${left}, ${right}]`,
        })
        .setArray(values, roles, [])
        .commit();
    },
  };

  countOccurrence(input, target, hooks);
  return rec.build();
}
