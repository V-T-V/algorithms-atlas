// =============================================================================
// 最左二分 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binarySearchLeftmost, type LeftmostHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];
export const DEFAULT_TARGET = 5;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let lo = 0;
  let hi = n;
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = lo; k < hi; k++) roles[k] = 'frontier';
    if (probe >= 0) roles[probe] = 'compare';
    const pointers: Array<{ index: number; label: string }> = [];
    if (lo < n) pointers.push({ index: lo, label: 'lo' });
    pointers.push({ index: Math.min(hi, n - 1), label: 'hi' });
    if (probe >= 0) pointers.push({ index: probe, label: 'mid' });
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot({ zh: `查找 ${target} 的最左下标`, en: `Find leftmost ${target}` });

  const hooks: LeftmostHooks = {
    onProbe: (l, h, mid, cmp) => {
      lo = l;
      hi = h;
      probe = mid;
      const rel =
        cmp === 0 ? '= 目标（继续向左）' : cmp < 0 ? '< 目标，lo=mid+1' : '> 目标，hi=mid';
      snapshot({
        zh: `mid=${mid} a[${mid}]=${values[mid]} ${rel}`,
        en: `mid=${mid} a[${mid}]=${values[mid]} ${rel}`,
      });
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `最左命中：${found}`, en: `Leftmost found: ${found}` }
            : { zh: `不存在`, en: `Absent` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  binarySearchLeftmost(input, target, hooks);

  return rec.build();
}
