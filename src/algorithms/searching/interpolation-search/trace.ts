// =============================================================================
// 插值搜索 · 录制帧序列
// 通过 interpolationSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interpolationSearch, type InterpolationSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
/** 演示默认要查找的目标值。 */
export const DEFAULT_TARGET = 70;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let lo = 0;
  let hi = n - 1;
  let pos = -1;
  let outOfRange = false;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (!outOfRange) {
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
    }
    if (pos >= 0 && pos >= lo && pos <= hi) roles[pos] = 'pivot';
    return roles;
  };

  const snapshot = (
    note: { zh: string; en: string },
    pointers: Array<{ index: number; label: string }>,
  ): void => {
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snapshot(
    {
      zh: `均匀升序数组中查找 ${target}，区间 [${lo}, ${hi}]`,
      en: `Search ${target} in a uniform sorted array, range [${lo}, ${hi}]`,
    },
    [
      { index: lo, label: 'lo' },
      { index: hi, label: 'hi' },
    ],
  );

  const hooks: InterpolationSearchHooks = {
    onProbe: (curLo, curHi, curPos) => {
      lo = curLo;
      hi = curHi;
      pos = curPos;
      snapshot(
        {
          zh: `插值估计 pos=${pos}，a[${pos}]=${values[pos]} 与目标 ${target} 比较`,
          en: `Estimate pos=${pos}, a[${pos}]=${values[pos]} vs target ${target}`,
        },
        [
          { index: lo, label: 'lo' },
          { index: pos, label: 'pos' },
          { index: hi, label: 'hi' },
        ],
      );
    },
    onShrink: (newLo, newHi, dir) => {
      lo = newLo;
      hi = newHi;
      if (lo > hi) outOfRange = true;
      const tip =
        dir === 'right'
          ? {
              zh: `目标更大 → 去右半 [${lo}, ${hi}]`,
              en: `Target is larger → right half [${lo}, ${hi}]`,
            }
          : {
              zh: `目标更小 → 去左半 [${lo}, ${hi}]`,
              en: `Target is smaller → left half [${lo}, ${hi}]`,
            };
      snapshot(tip, [
        { index: Math.max(lo, 0), label: 'lo' },
        { index: Math.min(hi, n - 1), label: 'hi' },
      ]);
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

  interpolationSearch(input, target, hooks);

  return rec.build();
}
