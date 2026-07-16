// =============================================================================
// Jaro 相似度 · 录制帧序列
// 用 setArray 展示两串（values 取字符码），pointers 标注 a 指针 i 与 b 匹配 j；
// setAux 展示匹配数、换位数与相似度。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jaro, type JaroHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = {
  a: 'MARTHA',
  b: 'MARHTA',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const la = a.length;
  const lb = b.length;
  let i = -1;
  let j = -1;
  let matches = 0;
  let transpositions = 0;
  let similarity = 0;

  const snapshot = (note: { zh: string; en: string }, roleI: BarRole): void => {
    const rolesA: BarRole[] = new Array(la).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (i >= 0 && i < la) {
      rolesA[i] = roleI;
      pointers.push({ index: i, label: 'i' });
    }
    if (j >= 0 && j < la) pointers.push({ index: Math.min(j, la - 1), label: 'j→b' });
    rec
      .begin(note)
      .setArray(CODE(a), rolesA, pointers)
      .setAux([
        { label: 'a', value: a, role: 'default' },
        { label: 'b', value: b, role: 'default' },
        { label: 'i / j', value: `${i < 0 ? '-' : i} / ${j < 0 ? '-' : j}`, role: 'compare' },
        { label: '匹配 m', value: `${matches}`, role: matches > 0 ? 'frontier' : 'default' },
        {
          label: '换位 t',
          value: `${transpositions}`,
          role: transpositions > 0 ? 'warn' : 'default',
        },
        { label: '相似度', value: similarity.toFixed(4), role: 'final' },
      ])
      .commit();
  };

  snapshot({ zh: `比较 "${a}" 与 "${b}"`, en: `Compare "${a}" vs "${b}"` }, 'default');

  const hooks: JaroHooks = {
    onWindow: () => {
      rec
        .begin({
          zh: `匹配窗口 w = floor(max(${la},${lb})/2) - 1`,
          en: `Match window w = floor(max(${la},${lb})/2) - 1`,
        })
        .setAux([
          { label: 'a', value: a, role: 'default' },
          { label: 'b', value: b, role: 'default' },
        ])
        .commit();
    },
    onMatch: (mi, mj) => {
      i = mi;
      j = mj;
      matches++;
      snapshot(
        {
          zh: `匹配：a[${mi}]='${a[mi]}' ↔ b[${mj}]='${b[mj]}'`,
          en: `Match: a[${mi}]='${a[mi]}' ↔ b[${mj}]='${b[mj]}'`,
        },
        'compare',
      );
    },
    onTranspositions: (t) => {
      transpositions = t;
      rec
        .begin({
          zh: `匹配字符顺序不一致的对数 → 换位 t = ${t}`,
          en: `Mismatched-order pairs among matches → transpositions t = ${t}`,
        })
        .setAux([
          { label: 'a', value: a, role: 'default' },
          { label: 'b', value: b, role: 'default' },
          { label: '匹配 m', value: `${matches}`, role: 'frontier' },
          { label: '换位 t', value: `${transpositions}`, role: 'warn' },
        ])
        .commit();
    },
  };

  similarity = jaro(a, b, hooks);

  // 终态
  i = -1;
  j = -1;
  rec
    .begin({
      zh: `完成：Jaro 相似度 = ${similarity.toFixed(4)}`,
      en: `Done: Jaro similarity = ${similarity.toFixed(4)}`,
    })
    .setArray(CODE(a), new Array(la).fill('final'), [])
    .setAux([
      { label: 'a', value: a, role: 'default' },
      { label: 'b', value: b, role: 'default' },
      { label: '匹配 m', value: `${matches}`, role: 'frontier' },
      { label: '换位 t', value: `${transpositions}`, role: 'warn' },
      { label: '相似度', value: similarity.toFixed(4), role: 'final' },
    ])
    .commit();

  return rec.build();
}
