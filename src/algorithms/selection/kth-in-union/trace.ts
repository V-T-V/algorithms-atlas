// 两个有序数组并集第 k 小 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kthInUnion, type KthInUnionHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  a: [1, 3, 5, 7, 9],
  b: [2, 4, 6, 8, 10],
  k: 6,
};

export function buildTrace(
  input: { a: number[]; b: number[]; k: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, k } = input;
  const aDiscard = new Set<number>();
  const bDiscard = new Set<number>();
  let aCmp = -1;
  let bCmp = -1;
  let resultVal: number | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const aRoles: BarRole[] = a.map((_, i) => (aDiscard.has(i) ? 'sorted' : 'default'));
    const bRoles: BarRole[] = b.map((_, i) => (bDiscard.has(i) ? 'sorted' : 'default'));
    if (aCmp >= 0 && aCmp < a.length && !aDiscard.has(aCmp)) aRoles[aCmp] = 'compare';
    if (bCmp >= 0 && bCmp < b.length && !bDiscard.has(bCmp)) bRoles[bCmp] = 'pivot';
    const aPtrs = aCmp >= 0 && aCmp < a.length ? [{ index: aCmp, label: 'a' }] : [];

    rec
      .begin(note)
      .setArray([...a], aRoles, aPtrs)
      .setAux([
        { label: '数组 A', value: `[${a.join(', ')}]`, role: 'compare' as BarRole },
        { label: '数组 B', value: `[${b.join(', ')}]`, role: 'pivot' as BarRole },
        {
          label: 'B 数组',
          value: b
            .map((v, i) => `${v}${bDiscard.has(i) ? '·' : ''}${i === bCmp ? '←' : ''}`)
            .join(' '),
          role: 'pivot' as BarRole,
        },
        { label: '剩余 k', value: String(k), role: 'frontier' as BarRole },
      ])
      .commit();
    // 同时显示 B 数组（用 aux 已展示，避免覆盖 array）
    aCmp = -1;
    bCmp = -1;
  };

  render({
    zh: `A=[${a.join(',')}] B=[${b.join(',')}] 找第 ${k} 小`,
    en: `Find ${k}-th smallest in union of A and B`,
  });

  const hooks: KthInUnionHooks = {
    onCompare: (kk, ai, bi) => {
      aCmp = ai;
      bCmp = bi;
      render({
        zh: `剩余 k=${kk}，比较 a[${ai}] 与 b[${bi}]`,
        en: `k=${kk} left, compare a[${ai}] vs b[${bi}]`,
      });
    },
    onDiscard: (which, lo, hi) => {
      const set = which === 'a' ? aDiscard : bDiscard;
      for (let i = lo; i <= hi; i++) set.add(i);
      render({
        zh: `排除 ${which.toUpperCase()}[${lo}..${hi}]`,
        en: `Discard ${which.toUpperCase()}[${lo}..${hi}]`,
      });
    },
    onResult: (value) => {
      resultVal = value;
    },
  };

  kthInUnion(a, b, k, hooks);

  const aRoles: BarRole[] = a.map(() => 'sorted' as BarRole);
  rec
    .begin({ zh: `第 ${k} 小 = ${resultVal}`, en: `${k}-th smallest = ${resultVal}` })
    .setArray([...a], aRoles, [])
    .setAux([{ label: '结果', value: String(resultVal), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
