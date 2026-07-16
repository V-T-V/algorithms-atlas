// =============================================================================
// 查找插入位置 · 录制帧序列
// setArray + lo/mid/hi 指针（lower bound）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchInsert, type SearchInsertHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 6];
export const DEFAULT_TARGET = 2;

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
    for (let k = lo; k <= hi && k >= 0; k++) roles[k] = 'frontier';
    if (mid >= 0) roles[mid] = 'pivot';
    return roles;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(values, rolesArr(), [
        { index: Math.max(lo, 0), label: 'lo' },
        { index: mid, label: 'mid' },
        { index: Math.min(hi, n - 1), label: 'hi' },
      ])
      .commit();
  };

  snap({ zh: `查找 ${target} 的插入位置`, en: `Insert position for ${target}` });

  const hooks: SearchInsertHooks = {
    onProbe: (curLo, curHi, curMid) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({
        zh: `mid=${mid}，a[${mid}]=${values[mid]}`,
        en: `mid=${mid}, a[${mid}]=${values[mid]}`,
      });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
    },
    onDone: (pos) => {
      const roles: BarRole[] = new Array(n).fill('default');
      const p = Math.min(pos, n - 1);
      if (p >= 0) roles[p] = 'final';
      rec
        .begin({ zh: `插入位置 ${pos}`, en: `Insert at ${pos}` })
        .setArray(values, roles, [{ index: p, label: 'ins' }])
        .commit();
    },
  };

  searchInsert(input, target, hooks);
  return rec.build();
}
