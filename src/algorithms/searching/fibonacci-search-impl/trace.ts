// =============================================================================
// 斐波那契搜索 · 录制帧序列
// 通过 fibonacciSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciSearch, type FibonacciSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [10, 22, 35, 40, 45, 50, 80, 82, 85, 90, 100];
export const DEFAULT_TARGET = 85;

/** 录制演示帧序列。input 须为升序数组。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;

  let probeI = -1;
  let curOffset = -1;
  let curFibM = -1;
  let lo = 0;
  let hi = n - 1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    for (let k = lo; k <= hi; k++) roles[k] = 'frontier';
    if (probeI >= 0) {
      roles[probeI] = 'compare';
      pointers.push({ index: probeI, label: 'i' });
    }
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([
        { label: 'offset', value: String(curOffset), role: 'pivot' },
        { label: 'fibM', value: String(curFibM), role: 'frontier' },
        { label: '区间', value: `[${lo}, ${hi}]` },
      ])
      .commit();
  };

  snapshot({
    zh: `升序数组中查找 ${target}（共 ${n} 个元素）`,
    en: `Search ${target} in sorted array of ${n} elements`,
  });

  const hooks: FibonacciSearchHooks = {
    onInit: (k) => {
      snapshot({
        zh: `选最小斐波那契序号 k=${k}（F(k) >= ${n}）`,
        en: `Pick smallest Fibonacci index k=${k} (F(k) >= ${n})`,
      });
    },
    onProbe: (i, offset, fibM) => {
      probeI = i;
      curOffset = offset;
      curFibM = fibM;
      snapshot({
        zh: `探测 i=${i}（offset=${offset} + fibM=${fibM}），a[${i}]=${values[i]!}`,
        en: `Probe i=${i} (offset=${offset} + fibM=${fibM}), a[${i}]=${values[i]!}`,
      });
    },
    onShrink: (dir) => {
      if (dir === 'left') {
        hi = probeI - 1;
      } else if (dir === 'right') {
        lo = probeI + 1;
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

  fibonacciSearch(input, target, hooks);

  return rec.build();
}
