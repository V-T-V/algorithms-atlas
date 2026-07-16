// =============================================================================
// 指数搜索 · 录制帧序列
// 通过 exponentialSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exponentialSearch, type ExponentialSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
export const DEFAULT_TARGET = 19;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  let boundPos = -1;
  let windowLo = -1;
  let windowHi = -1;
  let probeMid = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (windowLo >= 0 && windowHi >= 0) {
      for (let k = windowLo; k <= windowHi; k++) roles[k] = 'frontier';
    }
    if (boundPos >= 0 && boundPos < n) {
      roles[boundPos] = 'pivot';
      pointers.push({ index: boundPos, label: 'bound' });
    }
    if (probeMid >= 0) {
      roles[probeMid] = 'compare';
      pointers.push({ index: probeMid, label: 'mid' });
    }
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot({
    zh: `升序数组中查找 ${target}（共 ${n} 个元素）`,
    en: `Search ${target} in sorted array of ${n} elements`,
  });

  const hooks: ExponentialSearchHooks = {
    onBound: (pos) => {
      boundPos = pos;
      probeMid = -1;
      snapshot({
        zh: `倍增到 a[${pos}]=${values[pos]!}`,
        en: `Double to a[${pos}]=${values[pos]!}`,
      });
    },
    onWindow: (lo, hi) => {
      windowLo = lo;
      windowHi = hi;
      boundPos = -1;
      snapshot({
        zh: `定位候选区间 [${lo}, ${hi}]，开始二分`,
        en: `Window [${lo}, ${hi}] located; binary search`,
      });
    },
    onProbe: (lo, mid, hi) => {
      void lo;
      void hi;
      probeMid = mid;
      snapshot({
        zh: `二分：比较 a[${mid}]=${values[mid]!}`,
        en: `Binary: compare a[${mid}]=${values[mid]!}`,
      });
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at index ${found}` }
            : { zh: `未找到 ${target}`, en: `${target} not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
    },
  };

  exponentialSearch(input, target, hooks);

  return rec.build();
}
