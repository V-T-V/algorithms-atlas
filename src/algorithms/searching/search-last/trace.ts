// =============================================================================
// 查找最后一个等于 · 录制帧序列
// setArray + lo/mid/hi 指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchLast, type SearchLastHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 2, 3, 3, 4];
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

  snap({ zh: `查找最后一个 ${target}`, en: `Find last ${target}` });

  const hooks: SearchLastHooks = {
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
    onDone: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (idx >= 0) roles[idx] = 'final';
      rec
        .begin(
          idx >= 0
            ? { zh: `末个 ${target} 在 ${idx}`, en: `Last ${target} at ${idx}` }
            : { zh: '未找到', en: 'Not found' },
        )
        .setArray(values, roles, idx >= 0 ? [{ index: idx, label: '✓' }] : [])
        .commit();
    },
  };

  searchLast(input, target, hooks);
  return rec.build();
}
