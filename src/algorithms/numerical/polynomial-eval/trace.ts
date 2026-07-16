// =============================================================================
// 多项式求值（含导数）· 录制帧序列
// 演示 Horner 并发求 p(x) 与 p'(x) 的过程；setAux 展示每步累积。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polynomialEval, type PolynomialEvalHooks } from './impl.ts';

// p(x) = 2x³ - 6x² + 2x - 1
export const DEFAULT_INPUT = { coeffs: [2, -6, 2, -1], x: 3 };

/** 录制演示帧序列。 */
export function buildTrace(input: { coeffs: number[]; x: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { coeffs, x } = input;

  rec
    .begin({
      zh: `求多项式 ${coeffs.join(', ')} 在 x = ${x} 处的值与导数`,
      en: `Evaluate polynomial [${coeffs.join(', ')}] and its derivative at x = ${x}`,
    })
    .setAux([
      { label: '系数 (降幂)', value: coeffs.join(', '), role: 'pivot' },
      { label: 'x', value: String(x), role: 'pivot' },
    ])
    .commit();

  const hooks: PolynomialEvalHooks = {
    onStep: (step, valueAcc, derivAcc) => {
      rec
        .begin({
          zh: `第 ${step} 步：p 累积 = ${valueAcc}，p' 累积 = ${derivAcc}`,
          en: `Step ${step}: p acc = ${valueAcc}, p' acc = ${derivAcc}`,
        })
        .setAux([
          { label: '已处理系数', value: String(step + 1), role: 'compare' },
          { label: 'p 累积', value: String(valueAcc), role: 'frontier' },
          { label: "p' 累积", value: String(derivAcc), role: 'frontier' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const { value, derivative } = polynomialEval(coeffs, x, hooks);

  rec
    .begin({
      zh: `完成：p(${x}) = ${value}，p'(${x}) = ${derivative}`,
      en: `Done: p(${x}) = ${value}, p'(${x}) = ${derivative}`,
    })
    .setAux([
      { label: 'p(x)', value: String(value), role: 'final' },
      { label: "p'(x)", value: String(derivative), role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}
