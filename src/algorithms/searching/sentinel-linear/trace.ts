// =============================================================================
// 哨兵线性搜索 · 录制帧序列
// 通过 sentinelLinearSearch 的钩子，把执行过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sentinelLinearSearch, type SentinelLinearHooks } from './impl.ts';

export const DEFAULT_INPUT = [4, 2, 7, 1, 9, 3, 5, 8, 6];
export const DEFAULT_TARGET = 5;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let cur = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (cur >= 0) {
      roles[cur] = 'compare';
      pointers.push({ index: cur, label: 'i' });
    }
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot({
    zh: `查找 ${target}：把 ${target} 当哨兵放末尾`,
    en: `Search ${target}: place ${target} as sentinel at tail`,
  });

  const hooks: SentinelLinearHooks = {
    onCompare: (i) => {
      cur = i;
      snapshot({
        zh: `比较 a[${i}]=${values[i]} ≠ ${target}，继续`,
        en: `Compare a[${i}]=${values[i]} ≠ ${target}, continue`,
      });
    },
    onFound: (i) => {
      const roles: BarRole[] = new Array(n).fill('default');
      roles[i] = 'final';
      rec
        .begin({ zh: `命中：下标 ${i}`, en: `Found at index ${i}` })
        .setArray(values, roles, [{ index: i, label: '✓' }])
        .commit();
    },
    onNotFound: () => {
      const roles: BarRole[] = new Array(n).fill('default');
      rec
        .begin({ zh: `未找到 ${target}`, en: `${target} not found` })
        .setArray(values, roles, [])
        .commit();
    },
  };

  sentinelLinearSearch(input, target, hooks);

  return rec.build();
}
