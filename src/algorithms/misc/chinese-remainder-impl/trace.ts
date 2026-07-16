// =============================================================================
// 中国剩余定理 · 录制帧序列
// 用 setAux 展示逐个合并同余式的过程；末帧验证解满足所有同余。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crt, type Congruence, type CrtHooks } from './impl.ts';

export const DEFAULT_INPUT: { congruences: Congruence[] } = {
  // 经典物不知数：x≡2 (mod 3), x≡3 (mod 5), x≡2 (mod 7) → 23
  congruences: [
    { remainder: 2, modulus: 3 },
    { remainder: 3, modulus: 5 },
    { remainder: 2, modulus: 7 },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { congruences: Congruence[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { congruences } = input;

  rec
    .begin({
      zh: `求解同余方程组：${congruences.map((c) => `x ≡ ${c.remainder} (mod ${c.modulus})`).join(', ')}`,
      en: `Solve: ${congruences.map((c) => `x ≡ ${c.remainder} (mod ${c.modulus})`).join(', ')}`,
    })
    .setAux([
      { label: '同余式数', value: String(congruences.length), role: 'pivot' as BarRole },
      ...congruences.map((c) => ({
        label: `mod ${c.modulus}`,
        value: `x ≡ ${c.remainder}`,
        role: 'compare' as const,
      })),
    ])
    .commit();

  const hooks: CrtHooks = {
    onMerge: (step, c1, c2, merged) => {
      rec
        .begin({
          zh: `合并第 ${step} 条：x ≡ ${c1.remainder} (mod ${c1.modulus}) + x ≡ ${c2.remainder} (mod ${c2.modulus}) → x ≡ ${merged.remainder} (mod ${merged.modulus})`,
          en: `Merge #${step}: x ≡ ${c1.remainder} (mod ${c1.modulus}) + x ≡ ${c2.remainder} (mod ${c2.modulus}) → x ≡ ${merged.remainder} (mod ${merged.modulus})`,
        })
        .setAux([
          { label: '已合并余数', value: String(merged.remainder), role: 'final' as BarRole },
          { label: '已合并模数', value: String(merged.modulus), role: 'frontier' as BarRole },
          { label: '前一条 (mod)', value: String(c1.modulus), role: 'compare' as BarRole },
          { label: '新合并 (mod)', value: String(c2.modulus), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  const { x, modulus } = crt(congruences, hooks);

  // 终态：验证
  rec
    .begin({
      zh: `解 x = ${x}（模 ${modulus} 下唯一）。验证：${congruences
        .map((c) => `${x} mod ${c.modulus} = ${x % c.modulus} (≡ ${c.remainder})`)
        .join('; ')}`,
      en: `Solution x = ${x} (unique mod ${modulus}). Check: ${congruences
        .map((c) => `${x} mod ${c.modulus} = ${x % c.modulus} (≡ ${c.remainder})`)
        .join('; ')}`,
    })
    .setAux([
      { label: '解 x', value: String(x), role: 'final' as BarRole },
      { label: '总模数 M', value: String(modulus), role: 'frontier' as BarRole },
      ...congruences.map((c) => ({
        label: `x mod ${c.modulus}`,
        value: `${x % c.modulus} (应≡${c.remainder})`,
        role: (x % c.modulus === c.remainder ? 'final' : 'warn') as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
