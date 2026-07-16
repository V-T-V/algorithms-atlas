// =============================================================================
// 斐波那契矩阵快速幂 · 录制帧序列
// 通过 fibonacciMatrix 的钩子，把矩阵快速幂过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciMatrix, type FibonacciMatrixHooks, type M2 } from './impl.ts';

export const DEFAULT_INPUT = 10;

const fmt = (m: M2): string => `[[${m[0]}, ${m[1]}], [${m[2]}, ${m[3]}]]`;

/** 录制演示帧序列。 */
export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;

  rec
    .begin({ zh: `用矩阵快速幂 Mⁿ 计算 F_${n}`, en: `Compute F_${n} via matrix exponentiation Mⁿ` })
    .setAux([
      { label: 'M', value: '[[1,1],[1,0]]', role: 'frontier' as BarRole },
      { label: '关系', value: '[F_{n+1}, F_n]ᵀ = Mⁿ · [1,0]ᵀ', role: 'default' as BarRole },
    ])
    .commit();

  const hooks: FibonacciMatrixHooks = {
    onBit: (bit, exp) => {
      rec
        .begin({
          zh: `指数位：${bit}（剩余 e = ${exp}）`,
          en: `Exponent bit: ${bit} (remaining e = ${exp})`,
        })
        .setAux([
          {
            label: '当前位',
            value: String(bit),
            role: bit === 1 ? ('compare' as BarRole) : ('default' as BarRole),
          },
        ])
        .commit();
    },
    onSquare: (base) => {
      rec
        .begin({ zh: `base 自乘（平方）：${fmt(base)}`, en: `Square base: ${fmt(base)}` })
        .setAux([{ label: 'base', value: fmt(base), role: 'frontier' as BarRole }])
        .commit();
    },
    onMultiply: (result) => {
      rec
        .begin({
          zh: `当前位为 1，result × base：${fmt(result)}`,
          en: `Bit is 1, result × base: ${fmt(result)}`,
        })
        .setAux([{ label: 'result', value: fmt(result), role: 'final' as BarRole }])
        .commit();
    },
    onResult: (_, fn) => {
      rec
        .begin({ zh: `结果：F_${n} = ${fn}`, en: `Result: F_${n} = ${fn}` })
        .setAux([{ label: `F_${n}`, value: String(fn), role: 'final' as BarRole }])
        .commit();
    },
  };

  fibonacciMatrix(n, hooks);
  return rec.build();
}
