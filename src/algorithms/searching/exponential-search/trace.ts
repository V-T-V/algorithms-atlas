// =============================================================================
// 指数搜索 · 录制帧序列
// 通过 exponentialSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exponentialSearch, type ExponentialSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];
/** 演示默认要查找的目标值。 */
export const DEFAULT_TARGET = 18;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  let phase: 'bound' | 'range' | 'binary' = 'bound';
  let boundProbe = -1; // 倍增阶段探测下标
  let lo = 0;
  let hi = n - 1;
  let mid = -1;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (phase !== 'bound') {
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
    }
    if (phase === 'bound' && boundProbe >= 0) roles[boundProbe] = 'pivot';
    if (phase === 'binary' && mid >= 0 && mid >= lo && mid <= hi) roles[mid] = 'pivot';
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
      zh: `升序数组中查找 ${target}，先倍增定位区间再二分`,
      en: `Search ${target}: gallop to find a range, then binary search`,
    },
    [],
  );

  const hooks: ExponentialSearchHooks = {
    onBound: (bound) => {
      phase = 'bound';
      boundProbe = Math.min(bound, n) - 1;
      snapshot(
        {
          zh: `倍增 bound=${bound}，探测 a[${boundProbe}]=${values[boundProbe]}`,
          en: `Galloping bound=${bound}, probe a[${boundProbe}]=${values[boundProbe]}`,
        },
        [{ index: boundProbe, label: 'bound' }],
      );
    },
    onRange: (rLo, rHi) => {
      phase = 'range';
      lo = rLo;
      hi = rHi;
      snapshot(
        {
          zh: `定位二分区间 [${lo}, ${hi}]`,
          en: `Binary-search range [${lo}, ${hi}]`,
        },
        [
          { index: lo, label: 'lo' },
          { index: hi, label: 'hi' },
        ],
      );
    },
    onProbe: (curLo, curHi, curMid) => {
      phase = 'binary';
      lo = curLo;
      hi = curHi;
      mid = curMid;
      snapshot(
        {
          zh: `二分 mid=${mid}，a[${mid}]=${values[mid]} 与目标 ${target} 比较`,
          en: `Binary mid=${mid}, a[${mid}]=${values[mid]} vs target ${target}`,
        },
        [
          { index: lo, label: 'lo' },
          { index: mid, label: 'mid' },
          { index: hi, label: 'hi' },
        ],
      );
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
