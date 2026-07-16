// =============================================================================
// 哨兵查找 · 录制帧序列
// setArray：扫描指针 i 逐位前进；末位为哨兵。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sentinelSearch, type SentinelSearchHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];
export const DEFAULT_TARGET = 8;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let i = 0;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = 0; k < i && k < n; k++) roles[k] = 'sorted'; // 已扫描（非命中）
    if (i >= 0 && i < n) roles[i] = 'compare';
    if (n > 0) roles[n - 1] = roles[n - 1] === 'compare' ? 'compare' : 'frontier'; // 哨兵位
    return roles;
  };

  const snap = (note: { zh: string; en: string }): void => {
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0 && i < n) pointers.push({ index: i, label: 'i' });
    if (n > 0) pointers.push({ index: n - 1, label: 'sentinel' });
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snap({ zh: `哨兵查找 ${target}`, en: `Sentinel search ${target}` });

  const hooks: SentinelSearchHooks = {
    onCompare: (idx) => {
      i = idx;
      snap({
        zh: `比较 a[${idx}]=${values[idx]} 与 ${target}`,
        en: `Compare a[${idx}]=${values[idx]}`,
      });
    },
    onDone: (idx) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (idx >= 0) roles[idx] = 'final';
      rec
        .begin(
          idx >= 0 ? { zh: `命中 ${idx}`, en: `Found ${idx}` } : { zh: '未找到', en: 'Not found' },
        )
        .setArray(values, roles, idx >= 0 ? [{ index: idx, label: '✓' }] : [])
        .commit();
    },
  };

  sentinelSearch(input, target, hooks);
  return rec.build();
}
