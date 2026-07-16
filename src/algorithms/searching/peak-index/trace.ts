// =============================================================================
// 山脉数组峰顶 · 录制帧序列
// setArray + lo/mid/hi 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { peakIndex, type PeakIndexHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 1, 3, 5, 4, 2];

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
    rec
      .begin(note)
      .setArray(values, rolesArr(), [
        { index: lo, label: 'lo' },
        { index: mid, label: 'mid' },
        { index: hi, label: 'hi' },
      ])
      .commit();
  };

  snap({ zh: '山脉数组找峰顶', en: 'Find peak in mountain array' });

  const hooks: PeakIndexHooks = {
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
        .begin({ zh: `峰顶 a[${peak}]=${values[peak]}`, en: `Peak a[${peak}]=${values[peak]}` })
        .setArray(values, roles, [{ index: peak, label: 'peak' }])
        .commit();
    },
  };

  peakIndex(input, hooks);
  return rec.build();
}
