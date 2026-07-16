// =============================================================================
// 汉明距离 · 录制帧序列
// 用 setArray 展示两串（values 取字符码），pointers 标注当前比较位置 i；
// setAux 展示累计距离。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hamming, type HammingHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = {
  a: 'karolin',
  b: 'kathrin',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const n = a.length;
  let i = -1;
  let dist = 0;

  const snapshot = (note: { zh: string; en: string }, roleI: BarRole): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (i >= 0 && i < n) roles[i] = roleI;
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0) pointers.push({ index: i, label: 'i' });
    rec
      .begin(note)
      .setArray(CODE(a), roles, pointers)
      .setAux([
        { label: 'a', value: a, role: 'default' },
        { label: 'b', value: b, role: 'default' },
        { label: 'i', value: `${i < 0 ? '-' : i}`, role: 'compare' },
        { label: '距离 / distance', value: `${dist}`, role: dist > 0 ? 'warn' : 'default' },
      ])
      .commit();
  };

  snapshot({ zh: `比较 "${a}" 与 "${b}"`, en: `Compare "${a}" vs "${b}"` }, 'default');

  const hooks: HammingHooks = {
    onCompare: (idx, equal) => {
      i = idx;
      snapshot(
        equal
          ? {
              zh: `a[${idx}]='${a[idx]}' = b[${idx}]='${b[idx]}'，相同`,
              en: `a[${idx}]='${a[idx]}' = b[${idx}]='${b[idx]}', equal`,
            }
          : {
              zh: `a[${idx}]='${a[idx]}' ≠ b[${idx}]='${b[idx]}'，不同`,
              en: `a[${idx}]='${a[idx]}' ≠ b[${idx}]='${b[idx]}', different`,
            },
        equal ? 'compare' : 'warn',
      );
    },
    onDiff: (idx, d) => {
      dist = d;
      i = idx;
      snapshot(
        {
          zh: `第 ${idx} 位不同，距离 +1 → ${dist}`,
          en: `Position ${idx} differs, distance +1 → ${dist}`,
        },
        'warn',
      );
    },
  };

  hamming(a, b, hooks);

  // 终态：标记所有不同位
  const roles: BarRole[] = new Array(n).fill('default');
  for (let k = 0; k < n; k++) if (a[k] !== b[k]) roles[k] = 'final';
  i = -1;
  rec
    .begin({ zh: `完成：汉明距离 = ${dist}`, en: `Done: Hamming distance = ${dist}` })
    .setArray(CODE(a), roles, [])
    .setAux([
      { label: 'a', value: a, role: 'default' },
      { label: 'b', value: b, role: 'default' },
      { label: '距离 / distance', value: `${dist}`, role: 'final' },
    ])
    .commit();

  return rec.build();
}
