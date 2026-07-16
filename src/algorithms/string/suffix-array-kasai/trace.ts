// =============================================================================
// 后缀数组 + Kasai · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { suffixArrayKasai, type SuffixArrayKasaiHooks } from './impl.ts';

export const DEFAULT_INPUT: { s: string } = { s: 'banana' };

export function buildTrace(input: { s: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { s } = input;

  rec
    .begin({ zh: `构造 "${s}" 的后缀数组与 LCP`, en: `Build suffix array and LCP for "${s}"` })
    .setAux([{ label: 's', value: s, role: 'frontier' }])
    .commit();

  let sa: number[] = [];
  const hooks: SuffixArrayKasaiHooks = {
    onSuffixArray: (arr) => {
      sa = [...arr];
      rec
        .begin({
          zh: `后缀数组 SA = [${sa.join(', ')}]`,
          en: `Suffix array SA = [${sa.join(', ')}]`,
        })
        .setAux(
          sa.map((idx, i) => ({
            label: `SA[${i}]`,
            value: `"${s.slice(idx)}"`,
            role: (i === 0 ? 'final' : 'default') as BarRole,
          })),
        )
        .commit();
    },
    onLcp: (i, h) => {
      rec
        .begin({ zh: `后缀 ${i} 的 LCP = ${h}`, en: `LCP of suffix ${i} = ${h}` })
        .setAux([
          { label: '后缀 i', value: String(i), role: 'compare' },
          { label: 'LCP h', value: String(h), role: 'frontier' },
        ])
        .commit();
    },
  };

  const { height } = suffixArrayKasai(s, hooks);

  rec
    .begin({
      zh: `完成：height = [${height.join(', ')}]`,
      en: `Done: height = [${height.join(', ')}]`,
    })
    .setAux([{ label: 'height', value: height.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
