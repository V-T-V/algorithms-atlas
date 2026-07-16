// =============================================================================
// 模逆元 · 录制帧序列
// 用 setAux 展示「扩展欧几里得求 Bézout → 取模归一 → 得逆元」并验证。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modInverse, isInverse, type ModInverseHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number; m: number } = { a: 3, m: 11 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a: A, m: M } = input;

  rec
    .begin({
      zh: `求 ${A} 的模逆元（mod ${M}）：找 x 使 ${A}·x ≡ 1 (mod ${M})`,
      en: `Find modular inverse of ${A} (mod ${M}): x with ${A}·x ≡ 1 (mod ${M})`,
    })
    .setAux([
      { label: 'a', value: String(A), role: 'pivot' as BarRole },
      { label: 'm', value: String(M), role: 'frontier' as BarRole },
      { label: '条件', value: 'GCD(a,m)=1', role: 'compare' as BarRole },
    ])
    .commit();

  let finalInv: number | null = null;
  const hooks: ModInverseHooks = {
    onExtGcd: (a, m, gcd, x) => {
      const exists = gcd === 1;
      rec
        .begin({
          zh: `扩展欧几里得：${a}·${x} + ${m}·t = GCD = ${gcd}${exists ? ` → ${a}·${x} ≡ 1 (mod ${m})` : ` → 不互质，无逆元`}`,
          en: `Ext Euclidean: ${a}·${x} + ${m}·t = GCD = ${gcd}${exists ? ` → ${a}·${x} ≡ 1 (mod ${m})` : ` → not coprime, no inverse`}`,
        })
        .setAux([
          {
            label: 'GCD(a,m)',
            value: String(gcd),
            role: (gcd === 1 ? 'final' : 'warn') as BarRole,
          },
          { label: 'Bézout x', value: String(x), role: 'compare' as BarRole },
          {
            label: '互质?',
            value: exists ? '是 → 有逆元' : '否 → 无逆元',
            role: (exists ? 'final' : 'warn') as BarRole,
          },
        ])
        .commit();
    },
    onResult: (inv) => {
      finalInv = inv;
    },
  };

  modInverse(A, M, hooks);

  // 终态
  if (finalInv !== null) {
    const check = Number((((BigInt(A) * BigInt(finalInv)) % BigInt(M)) + BigInt(M)) % BigInt(M));
    rec
      .begin({
        zh: `逆元 = ${finalInv}。验证：${A}·${finalInv} mod ${M} = ${check} ${check === 1 ? '✓' : '✗'}`,
        en: `Inverse = ${finalInv}. Check: ${A}·${finalInv} mod ${M} = ${check} ${check === 1 ? 'OK' : 'FAIL'}`,
      })
      .setAux([
        { label: '逆元 x', value: String(finalInv), role: 'final' as BarRole },
        {
          label: 'a · x mod m',
          value: String(check),
          role: (check === 1 ? 'final' : 'warn') as BarRole,
        },
        {
          label: '正确?',
          value: check === 1 ? '是 / yes' : '否 / no',
          role: (check === 1 ? 'final' : 'warn') as BarRole,
        },
      ])
      .commit();
  } else {
    rec
      .begin({
        zh: `${A} 与 ${M} 不互质，模逆元不存在`,
        en: `${A} and ${M} are not coprime; modular inverse does not exist`,
      })
      .setAux([{ label: '结论', value: '无逆元 / no inverse', role: 'warn' as BarRole }])
      .commit();
  }

  void isInverse;
  return rec.build();
}
