// =============================================================================
// 有序数组单一元素 · 录制帧序列
// setArray + lo/mid/hi 指针（mid 规范到偶数下标）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { singleElem, type SingleElemHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 1, 2, 3, 3, 4, 4, 8, 8];

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
    if (mid + 1 < n && mid >= 0) roles[mid + 1] = 'compare';
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

  snap({ zh: '找单一元素', en: 'Find single element' });

  const hooks: SingleElemHooks = {
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
    onDone: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[idx] = 'final';
      rec
        .begin({ zh: `单一元素 a[${idx}]=${values[idx]}`, en: `Single a[${idx}]=${values[idx]}` })
        .setArray(values, roles, [{ index: idx, label: '✓' }])
        .commit();
    },
  };

  singleElem(input, hooks);
  return rec.build();
}
