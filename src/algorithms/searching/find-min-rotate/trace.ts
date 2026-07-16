// =============================================================================
// 旋转数组最小值 · 录制帧序列
// setArray + lo/mid/hi 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinRotate, type FindMinRotateHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 5, 6, 7, 0, 1, 2];

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
    roles[hi] = roles[hi] === 'pivot' ? 'pivot' : 'compare';
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

  snap({ zh: `旋转数组找最小值`, en: `Find min in rotated array` });

  const hooks: FindMinRotateHooks = {
    onProbe: (curLo, curHi, curMid) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({
        zh: `mid=${mid}，a[${mid}]=${values[mid]} vs a[${hi}]=${values[hi]}`,
        en: `mid=${mid}, a[${mid}]=${values[mid]} vs a[${hi}]=${values[hi]}`,
      });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (minIdx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[minIdx] = 'final';
      rec
        .begin({
          zh: `最小值 a[${minIdx}]=${values[minIdx]}`,
          en: `Min a[${minIdx}]=${values[minIdx]}`,
        })
        .setArray(values, roles, [{ index: minIdx, label: 'min' }])
        .commit();
    },
  };

  findMinRotate(input, hooks);
  return rec.build();
}
