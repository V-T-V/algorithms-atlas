// =============================================================================
// 连分数 · 录制帧序列
// 通过 continuedFraction 的钩子，把展开过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { continuedFraction, type ContinuedFractionHooks } from './impl.ts';

export const DEFAULT_INPUT = { p: 355, q: 113 }; // π 的著名近似 355/113

/** 录制演示帧序列。 */
export function buildTrace(input: { p: number; q: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { p, q } = input;
  const coeffs: bigint[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const expr =
      coeffs.length === 0 ? '?' : coeffs.map((c, i) => (i === 0 ? `${c}` : `1/${c}`)).join(' + ');
    rec
      .begin(note)
      .setAux([
        { label: '系数', value: coeffs.join(', ') || '—', role: 'frontier' as BarRole },
        { label: '连分数', value: expr, role: 'final' as BarRole },
      ])
      .commit();
  };

  rec
    .begin({ zh: `把 ${p}/${q} 展开为连分数`, en: `Expand ${p}/${q} as a continued fraction` })
    .setAux([{ label: `${p}/${q}`, value: '?', role: 'frontier' as BarRole }])
    .commit();

  const hooks: ContinuedFractionHooks = {
    onCoefficient: (k, a) => {
      coeffs.push(a);
      snapshot({
        zh: `提取第 ${k} 个部分商 a_${k} = ${a}`,
        en: `Extract the ${k}-th partial quotient a_${k} = ${a}`,
      });
    },
    onResult: () => {
      snapshot({ zh: `展开完成`, en: `Expansion complete` });
    },
  };

  continuedFraction(p, q, hooks);
  return rec.build();
}
