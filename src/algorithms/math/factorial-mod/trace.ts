// =============================================================================
// 阶乘取模 · 录制帧序列
// 通过 factorialMod 的钩子，把累乘过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorialMod, type FactorialModHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 10, m: 1000000007 };

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, m } = input;

  const snapshot = (note: { zh: string; en: string }, i: number, prod: number): void => {
    rec
      .begin(note)
      .setAux([
        { label: 'i', value: String(i), role: 'frontier' as BarRole },
        {
          label: `i! mod ${m}`,
          value: String(prod),
          role: i === n ? ('final' as BarRole) : ('compare' as BarRole),
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `计算 ${n}! mod ${m}（逐项累乘取模）`,
      en: `Compute ${n}! mod ${m} (term-by-term modulo)`,
    })
    .setAux([{ label: `${n}! mod ${m}`, value: '—', role: 'frontier' as BarRole }])
    .commit();

  const hooks: FactorialModHooks = {
    onStep: (i, prod) => {
      snapshot({ zh: `${i}! mod ${m} = ${prod}`, en: `${i}! mod ${m} = ${prod}` }, i, prod);
    },
    onResult: (result) => {
      snapshot(
        { zh: `结果：${n}! mod ${m} = ${result}`, en: `Result: ${n}! mod ${m} = ${result}` },
        n,
        result,
      );
    },
  };

  factorialMod(n, m, hooks);
  return rec.build();
}
