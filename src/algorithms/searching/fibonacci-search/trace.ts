// =============================================================================
// 斐波那契搜索 · 录制帧序列
// 用 setArray 展示升序数组（values），pointers 标注 offset/lo（区间左端）与探测点 i。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciSearch, fibsUpTo, type FibonacciSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
/** 演示默认要查找的目标值。 */
export const DEFAULT_TARGET = 13;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  const fib = fibsUpTo(n);

  let offset = -1; // 区间左端的前一位
  let probeIdx = -1;
  let outOfRange = false;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(values.length).fill('default');
    if (!outOfRange) {
      // 区间内 [offset+1, n-1] 标为 frontier
      for (let k = offset + 1; k < n; k++) roles[k] = 'frontier';
    }
    if (probeIdx >= 0 && probeIdx < n) roles[probeIdx] = 'pivot';
    return roles;
  };

  const snapshot = (
    note: { zh: string; en: string },
    extraPointers: Array<{ index: number; label: string }> = [],
  ): void => {
    const pointers: Array<{ index: number; label: string }> = [];
    const lo = Math.max(offset + 1, 0);
    if (lo < n) pointers.push({ index: lo, label: 'lo' });
    pointers.push(...extraPointers);
    rec.begin(note).setArray(values, rolesArr(), pointers).setAux(auxRows()).commit();
  };

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'target', value: String(target), role: 'pivot' },
    { label: 'lo', value: String(Math.max(offset + 1, 0)), role: 'frontier' },
    {
      label: 'fib(≤n)',
      value: `[${fib.join(', ')}]`,
      role: 'default',
    },
  ];

  snapshot({
    zh: `在升序数组中查找 ${target}，用斐波那契数划分区间`,
    en: `Search ${target} in a sorted array, partition by Fibonacci numbers`,
  });

  const hooks: FibonacciSearchHooks = {
    onProbe: (_offset, i, fibM) => {
      offset = _offset - 1;
      probeIdx = i;
      snapshot(
        {
          zh: `探测 i=${i}（当前 F(k)=${fibM}），a[${i}]=${values[i]} 与 ${target} 比较`,
          en: `Probe i=${i} (F(k)=${fibM}), a[${i}]=${values[i]} vs ${target}`,
        },
        [{ index: i, label: 'i' }],
      );
    },
    onCompare: (i, _v, dir) => {
      probeIdx = i;
      const tip =
        dir === 'right'
          ? { zh: `a[${i}] < ${target} → 去右子区间`, en: `a[${i}] < ${target} → right sub-range` }
          : dir === 'left'
            ? { zh: `a[${i}] > ${target} → 去左子区间`, en: `a[${i}] > ${target} → left sub-range` }
            : { zh: `命中 a[${i}] = ${target}`, en: `Hit a[${i}] = ${target}` };
      snapshot(tip, [{ index: i, label: 'i' }]);
    },
    onShrink: (oldOff, newOff, dir) => {
      offset = newOff - 1;
      if (dir === 'right') {
        snapshot(
          {
            zh: `去右：区间左端 ${oldOff} → ${newOff}`,
            en: `Right: range left ${oldOff} → ${newOff}`,
          },
          [],
        );
      } else {
        snapshot(
          {
            zh: `去左：区间左端保持 ${newOff}（丢弃右段）`,
            en: `Left: range left stays ${newOff} (drop right segment)`,
          },
          [],
        );
      }
    },
    onDone: (found) => {
      const roles: BarRole[] = new Array(values.length).fill('default');
      if (found >= 0) roles[found] = 'final';
      rec
        .begin(
          found >= 0
            ? { zh: `命中：下标 ${found}`, en: `Found at index ${found}` }
            : { zh: `未找到 ${target}`, en: `${target} not found` },
        )
        .setArray(values, roles, found >= 0 ? [{ index: found, label: '✓' }] : [])
        .commit();
      outOfRange = found < 0;
    },
  };

  fibonacciSearch(input, target, hooks);

  return rec.build();
}
