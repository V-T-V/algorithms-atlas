// =============================================================================
// 指数搜索变体 Galloping Search · 录制帧序列
// 用 setArray 展示升序数组（values），pointers 标注 bound（倍增探测点）与 mid（二分中点）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gallopingSearch, type GallopingSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
/** 演示默认要查找的目标值。 */
export const DEFAULT_TARGET = 17;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  let bound = 1; // 倍增边界
  let lo = 0;
  let hi = n - 1;
  let mid = -1;
  let phase: 'gallop' | 'binary' = 'gallop';

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (phase === 'binary') {
      // 二分区间内
      for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
      if (mid >= 0) roles[mid] = 'pivot';
    } else {
      // gallop 阶段：高亮已跳过的部分
      for (let k = 0; k < Math.min(bound, n); k++) roles[k] = 'frontier';
    }
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
      zh: `升序数组中找下界（第一个 ≥ ${target}），先倍增定位区间`,
      en: `Find lower bound (first ≥ ${target}) in sorted array; gallop first`,
    },
    [{ index: Math.min(bound, n) - 1, label: 'bound' }],
  );

  const hooks: GallopingSearchHooks = {
    onGallops: (b) => {
      phase = 'gallop';
      bound = b;
      snapshot(
        {
          zh: `倍增 bound=${b}，a[${Math.min(b, n) - 1}]=${values[Math.min(b, n) - 1]} < ${target} → 继续`,
          en: `Gallop bound=${b}, a[${Math.min(b, n) - 1}]=${values[Math.min(b, n) - 1]} < ${target} → continue`,
        },
        [{ index: Math.min(b, n) - 1, label: 'bound' }],
      );
    },
    onRange: (rLo, rHi) => {
      phase = 'binary';
      lo = rLo;
      hi = rHi;
      snapshot(
        {
          zh: `倍增结束，二分区间 [${lo}, ${hi}]`,
          en: `Gallop done, binary-search range [${lo}, ${hi}]`,
        },
        [
          { index: lo, label: 'lo' },
          { index: hi, label: 'hi' },
        ],
      );
    },
    onProbe: (pLo, pHi, pMid) => {
      phase = 'binary';
      lo = pLo;
      hi = pHi;
      mid = pMid;
      snapshot(
        {
          zh: `二分 mid=${mid}，a[${mid}]=${values[mid]} 与 ${target} 比较`,
          en: `Binary mid=${mid}, a[${mid}]=${values[mid]} vs ${target}`,
        },
        [
          { index: lo, label: 'lo' },
          { index: mid, label: 'mid' },
          { index: hi, label: 'hi' },
        ],
      );
    },
    onDone: (index, exact) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (index < n) roles[index] = exact ? 'final' : 'compare';
      rec
        .begin(
          exact
            ? { zh: `命中：下界 = ${index}`, en: `Found exact: lower bound = ${index}` }
            : index >= n
              ? {
                  zh: `target 比所有元素都大，下界 = n = ${n}`,
                  en: `target exceeds all, lower bound = n = ${n}`,
                }
              : {
                  zh: `无精确匹配，下界（插入点）= ${index}`,
                  en: `No exact match, lower bound (insertion point) = ${index}`,
                },
        )
        .setArray(values, roles, index < n ? [{ index, label: 'lb' }] : [])
        .commit();
    },
  };

  gallopingSearch(input, target, hooks);

  return rec.build();
}
