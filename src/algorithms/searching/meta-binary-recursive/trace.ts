// =============================================================================
// 元二分查找（递归）· 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { metaBinaryRecursive, type MetaBinaryRecHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
export const DEFAULT_TARGET = 23;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (probe >= 0) roles[probe] = 'compare';
    rec
      .begin(note)
      .setArray(values, roles, probe >= 0 ? [{ index: probe, label: 'mid' }] : [])
      .commit();
  };

  snapshot({ zh: `递归元二分查找 ${target}`, en: `Recursive meta binary search for ${target}` });

  const hooks: MetaBinaryRecHooks = {
    onProbe: (bit, mid) => {
      probe = mid;
      snapshot({ zh: `bit=${bit}：候选 mid=${mid}`, en: `bit=${bit}: candidate mid=${mid}` });
    },
    onDecide: (_bit, mid, setOne) => {
      snapshot({
        zh: `${mid < n ? `a[${mid}]=${values[mid]}` : `mid=${mid} 越界`} → 该位${setOne ? '置 1' : '清 0'}`,
        en: `${mid < n ? `a[${mid}]=${values[mid]}` : `mid=${mid} OOB`} → bit ${setOne ? '1' : '0'}`,
      });
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at ${found}` }
            : { zh: `未找到`, en: `Not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  metaBinaryRecursive(input, target, hooks);

  return rec.build();
}
