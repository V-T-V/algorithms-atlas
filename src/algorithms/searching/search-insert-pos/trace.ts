// =============================================================================
// 搜索插入位置 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { searchInsertPos, type InsertPosHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 6, 8, 10];
export const DEFAULT_TARGET = 5;

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  target: number = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const values = [...input];
  const n = values.length;
  let lo = 0;
  let hi = n;
  let probe = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    for (let k = lo; k < hi; k++) roles[k] = 'frontier';
    if (probe >= 0) roles[probe] = 'compare';
    const pointers: Array<{ index: number; label: string }> = [];
    if (lo < n) pointers.push({ index: lo, label: 'lo' });
    pointers.push({ index: Math.min(hi, n - 1), label: 'hi' });
    if (probe >= 0) pointers.push({ index: probe, label: 'mid' });
    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot({ zh: `查找 ${target} 的插入位置`, en: `Find insert position for ${target}` });

  const hooks: InsertPosHooks = {
    onProbe: (l, h, mid) => {
      lo = l;
      hi = h;
      probe = mid;
      snapshot({
        zh: `探测 mid=${mid}，a[mid]=${values[mid]}`,
        en: `Probe mid=${mid}, a[mid]=${values[mid]}`,
      });
    },
    onShrink: (l, h, dir) => {
      lo = l;
      hi = h;
      snapshot({
        zh: `向${dir === 'left' ? '左' : '右'}收缩 → [${l}, ${h})`,
        en: `Shrink ${dir} → [${l}, ${h})`,
      });
    },
    onDone: (res) => {
      const roles: BarRole[] = new Array(n).fill('default');
      if (res.pos < n) roles[res.pos] = res.exists ? 'final' : 'warn';
      rec
        .begin(
          res.exists
            ? { zh: `${target} 已存在于下标 ${res.pos}`, en: `${target} exists at ${res.pos}` }
            : {
                zh: `${target} 应插入到下标 ${res.pos}`,
                en: `${target} should insert at ${res.pos}`,
              },
        )
        .setArray(values, roles, [{ index: res.pos, label: res.exists ? '✓' : '⤓' }])
        .commit();
    },
  };

  searchInsertPos(input, target, hooks);

  return rec.build();
}
