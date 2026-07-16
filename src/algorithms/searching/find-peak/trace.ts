// =============================================================================
// 寻找峰值 · 录制帧序列
// setArray + lo/mid/hi 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findPeak, type FindPeakHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 1, 3, 5, 6, 4];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let lo = 0;
  let hi = n - 1;
  let mid = -1;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
    if (mid >= 0) roles[mid] = 'pivot';
    return roles;
  };

  const snap = (note: { zh: string; en: string }): void => {
    const pointers: Array<{ index: number; label: string }> = [{ index: lo, label: 'lo' }];
    if (mid >= 0) pointers.push({ index: mid, label: 'mid' });
    pointers.push({ index: hi, label: 'hi' });
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snap({ zh: '寻找峰值', en: 'Find a peak' });

  const hooks: FindPeakHooks = {
    onProbe: (curLo, curHi, curMid) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({
        zh: `mid=${mid}，a[${mid}]=${values[mid]} vs a[${mid + 1}]=${values[mid + 1]}`,
        en: `mid=${mid}`,
      });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (peak) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[peak] = 'final';
      rec
        .begin({ zh: `峰值 a[${peak}]=${values[peak]}`, en: `Peak a[${peak}]=${values[peak]}` })
        .setArray(values, roles, [{ index: peak, label: 'peak' }])
        .commit();
    },
  };

  findPeak(input, hooks);
  return rec.build();
}
