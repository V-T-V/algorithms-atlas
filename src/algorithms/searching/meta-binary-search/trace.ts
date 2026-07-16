// =============================================================================
// Meta 二分搜索 · 录制帧序列
// 通过 metaBinarySearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { metaBinarySearch, type MetaBinaryHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
export const DEFAULT_TARGET = 15;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  let probeCandidate = -1;
  let pos = 0;

  const snapshot = (
    note: { zh: string; en: string },
    extraPointers: Array<{ index: number; label: string }> = [],
  ): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos >= 0 && pos < n) {
      roles[pos] = 'frontier';
      pointers.push({ index: pos, label: 'pos' });
    }
    if (probeCandidate >= 0 && probeCandidate < n) roles[probeCandidate] = 'compare';
    if (probeCandidate >= 0 && probeCandidate < n)
      pointers.push({ index: probeCandidate, label: 'cand' });
    rec
      .begin(note)
      .setArray(values, roles, [...pointers, ...extraPointers])
      .commit();
  };

  snapshot(
    {
      zh: `升序数组中查找 ${target}，共 ${n} 个元素`,
      en: `Search ${target} in sorted array of ${n} elements`,
    },
    [],
  );

  const hooks: MetaBinaryHooks = {
    onInit: (msb) => {
      snapshot(
        {
          zh: `最高试探位 msb = ${msb}`,
          en: `Most significant probe bit msb = ${msb}`,
        },
        [],
      );
    },
    onProbe: (k, curPos, candidate) => {
      probeCandidate = candidate;
      pos = curPos;
      const inRange = candidate < n;
      snapshot(
        {
          zh: `位 k=${k}：候选下标 = ${curPos} + ${1 << k} = ${candidate}${inRange ? '' : '（越界，跳过）'}`,
          en: `Bit k=${k}: candidate = ${curPos} + ${1 << k} = ${candidate}${inRange ? '' : ' (out of range, skip)'}`,
        },
        [],
      );
    },
    onDecide: (k, setBit) => {
      void k;
      if (setBit) {
        snapshot(
          {
            zh: `a[${probeCandidate}]=${values[probeCandidate]!} ≤ ${target} → 置位，pos = ${probeCandidate}`,
            en: `a[${probeCandidate}]=${values[probeCandidate]!} ≤ ${target} → set bit, pos = ${probeCandidate}`,
          },
          [],
        );
        pos = probeCandidate;
      } else {
        snapshot(
          {
            zh: `a[${probeCandidate}]=${values[probeCandidate]!} > ${target} → 不置位`,
            en: `a[${probeCandidate}]=${values[probeCandidate]!} > ${target} → clear bit`,
          },
          [],
        );
      }
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

  metaBinarySearch(input, target, hooks);

  return rec.build();
}
