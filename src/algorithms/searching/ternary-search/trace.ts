// =============================================================================
// 三分查找 · 录制帧序列
// setArray + m1/m2 两个内分点指针。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ternarySearch, type TernarySearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 8, 6, 4, 2];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let lo = 0;
  let hi = n - 1;
  let m1 = -1;
  let m2 = -1;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
    if (m1 >= 0) roles[m1] = 'pivot';
    if (m2 >= 0) roles[m2] = 'compare';
    return roles;
  };

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(values, rolesArr(), [
        { index: lo, label: 'lo' },
        { index: m1, label: 'm1' },
        { index: m2, label: 'm2' },
        { index: hi, label: 'hi' },
      ])
      .commit();
  };

  snap({ zh: '三分查找最大值', en: 'Ternary search for max' });

  const hooks: TernarySearchHooks = {
    onProbe: (curLo, curHi, p1, p2) => {
      lo = curLo;
      hi = curHi;
      m1 = p1;
      m2 = p2;
      snap({
        zh: `m1=${m1}(a=${values[m1]}) vs m2=${m2}(a=${values[m2]})`,
        en: `m1=${m1} vs m2=${m2}`,
      });
    },
    onShrink: (newLo, newHi) => {
      lo = newLo;
      hi = newHi;
      m1 = -1;
      m2 = -1;
    },
    onDone: (best) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[best] = 'final';
      rec
        .begin({ zh: `最大值 a[${best}]=${values[best]}`, en: `Max a[${best}]=${values[best]}` })
        .setArray(values, roles, [{ index: best, label: 'max' }])
        .commit();
    },
  };

  ternarySearch(input, hooks);
  return rec.build();
}
