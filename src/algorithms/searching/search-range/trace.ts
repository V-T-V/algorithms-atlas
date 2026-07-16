// =============================================================================
// 查找区间 · 录制帧序列
// setArray + lo/mid/hi 指针；两阶段（找首、找末）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchRange, type SearchRangeHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 7, 7, 8, 8, 10];
export const DEFAULT_TARGET = 8;

/** 录制演示帧序列。 */
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

  snap({ zh: `查找 ${target} 的区间`, en: `Range of ${target}` });

  const hooks: SearchRangeHooks = {
    onProbe: (curLo, curHi, curMid, phase) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({ zh: `[${phase}] mid=${mid}，a[${mid}]=${values[mid]}`, en: `[${phase}] mid=${mid}` });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (first, last) => {
      const roles: BarRole[] = new Array(n).fill('default');
      for (let k = first; k <= last && k >= 0; k++) roles[k] = 'final';
      rec
        .begin(
          first >= 0
            ? { zh: `区间 [${first}, ${last}]`, en: `Range [${first}, ${last}]` }
            : { zh: '未找到', en: 'Not found' },
        )
        .setArray(values, roles, [])
        .commit();
    },
  };

  searchRange(input, target, hooks);
  return rec.build();
}
