// =============================================================================
// 元二分查找 · 录制帧序列
// setArray + 候选 mid 指针；从高位到低位确定答案。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { metaBinary, type MetaBinaryHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 11, 13, 15];
export const DEFAULT_TARGET = 11;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let pos = 0;
  let candidate = 0;

  const rolesArr = (): BarRole[] => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (pos >= 0 && pos < n) roles[pos] = 'final';
    if (candidate >= 0 && candidate < n && candidate !== pos) roles[candidate] = 'pivot';
    return roles;
  };

  const snap = (note: { zh: string; en: string }): void => {
    const pointers: Array<{ index: number; label: string }> = [];
    if (candidate >= 0 && candidate < n) pointers.push({ index: candidate, label: 'cand' });
    if (pos >= 0 && pos < n && pos !== candidate) pointers.push({ index: pos, label: 'pos' });
    rec.begin(note).setArray(values, rolesArr(), pointers).commit();
  };

  snap({ zh: `元二分查找 ${target}`, en: `Meta binary search ${target}` });

  const hooks: MetaBinaryHooks = {
    onProbe: (bit, cand) => {
      candidate = cand;
      snap({
        zh: `位 ${bit}：候选 ${cand}，a[${cand}]=${values[cand]}`,
        en: `Bit ${bit}: cand ${cand}, a[${cand}]=${values[cand]}`,
      });
    },
    onDecide: (bit, cand, setOne) => {
      if (setOne) pos = cand;
      snap({
        zh: `位 ${bit}：${setOne ? '置 1（pos=' + cand + '）' : '清 0'}`,
        en: `Bit ${bit}: ${setOne ? 'set' : 'clear'}`,
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

  metaBinary(input, target, hooks);
  return rec.build();
}
