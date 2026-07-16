// =============================================================================
// 旋转数组搜索 · 录制帧序列
// setArray + lo/mid/hi 指针；标注哪半有序。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchRotate, type SearchRotateHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 5, 6, 7, 0, 1, 2];
export const DEFAULT_TARGET = 0;

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

  snap({ zh: `旋转数组中查找 ${target}`, en: `Search ${target} in rotated array` });

  const hooks: SearchRotateHooks = {
    onProbe: (curLo, curHi, curMid) => {
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snap({
        zh: `mid=${mid}，a[${mid}]=${values[mid]}`,
        en: `mid=${mid}, a[${mid}]=${values[mid]}`,
      });
    },
    onShrink: (newLo, newHi, dir, sortedHalf) => {
      lo = newLo;
      hi = newHi;
      mid = -1;
      snap({
        zh: `${sortedHalf === 'left' ? '左' : '右'}半有序 → 去${dir === 'left' ? '左' : '右'}`,
        en: `${sortedHalf} half sorted → ${dir}`,
      });
    },
    onDone: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (idx >= 0) roles[idx] = 'final';
      rec
        .begin(
          idx >= 0 ? { zh: `命中 ${idx}`, en: `Found ${idx}` } : { zh: '未找到', en: 'Not found' },
        )
        .setArray(values, roles, idx >= 0 ? [{ index: idx, label: '✓' }] : [])
        .commit();
    },
  };

  searchRotate(input, target, hooks);
  return rec.build();
}
