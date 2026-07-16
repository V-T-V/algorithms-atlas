// =============================================================================
// 威尔逊定理 · 录制帧序列
// 通过 wilson 的钩子，把累乘过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wilson, type WilsonHooks } from './impl.ts';

export const DEFAULT_INPUT = 11;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;

  const aux = (i: number, prodMod: number, role: BarRole = 'compare'): void => {
    rec
      .begin({
        zh: `${i === 0 ? '1' : `累乘到 ${i}`}：∏ mod ${n} = ${prodMod}`,
        en: `${i === 0 ? '1' : `multiply up to ${i}`}: ∏ mod ${n} = ${prodMod}`,
      })
      .setAux([
        { label: '当前项 i', value: String(i), role: 'frontier' as BarRole },
        { label: '∏ mod n', value: String(prodMod), role },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `判定 ${n} 是否为素数：计算 (n-1)! mod n`,
      en: `Test if ${n} is prime: compute (n-1)! mod n`,
    })
    .setAux([
      { label: '威尔逊定理', value: 'n 素 ⟺ (n-1)! ≡ -1 (mod n)', role: 'frontier' as BarRole },
    ])
    .commit();

  aux(0, 1);

  const hooks: WilsonHooks = {
    onMultiply: (i, prodMod) => aux(i, prodMod),
    onResult: (_, factorialMod, prime) => {
      rec
        .begin({
          zh: prime
            ? `(n-1)! mod ${n} = ${factorialMod} = n-1 ⇒ ${n} 是素数`
            : `(n-1)! mod ${n} = ${factorialMod} ≠ n-1 ⇒ ${n} 不是素数`,
          en: prime
            ? `(n-1)! mod ${n} = ${factorialMod} = n-1 ⇒ ${n} is prime`
            : `(n-1)! mod ${n} = ${factorialMod} ≠ n-1 ⇒ ${n} is NOT prime`,
        })
        .setAux([
          { label: '(n-1)! mod n', value: String(factorialMod), role: 'final' as BarRole },
          {
            label: '判定',
            value: prime ? '素数 / prime' : '合数 / composite',
            role: prime ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit();
    },
  };

  wilson(n, hooks);
  return rec.build();
}
