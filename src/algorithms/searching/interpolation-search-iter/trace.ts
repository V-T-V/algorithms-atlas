// =============================================================================
// 插值搜索（迭代）· 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interpolationSearchIter, type InterpSearchIterHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const DEFAULT_TARGET = 70;

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
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
    if (probe >= 0) roles[probe] = 'compare';
    const pointers: Array<{ index: number; label: string }> = [];
    pointers.push({ index: lo, label: 'lo' });
    pointers.push({ index: hi, label: 'hi' });
    if (probe >= 0) pointers.push({ index: probe, label: 'pos' });
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot({
    zh: `在均匀升序数组中查找 ${target}`,
    en: `Search ${target} in uniform sorted array`,
  });

  const hooks: InterpSearchIterHooks = {
    onProbe: (l, h, pos, v) => {
      lo = l;
      hi = h;
      probe = pos;
      snapshot({
        zh: `插值估计 pos=${pos}，a[pos]=${v}`,
        en: `Interpolated pos=${pos}, a[pos]=${v}`,
      });
    },
    onCompare: (pos, cmp) => {
      const rel = cmp === 0 ? '= 目标' : cmp < 0 ? '< 目标，右移 lo' : '> 目标，左移 hi';
      snapshot({ zh: `比较 a[${pos}] ${rel}`, en: `Compare a[${pos}] ${rel}` });
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at ${found}` }
            : { zh: `未找到 ${target}`, en: `${target} not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  interpolationSearchIter(input, target, hooks);

  return rec.build();
}
