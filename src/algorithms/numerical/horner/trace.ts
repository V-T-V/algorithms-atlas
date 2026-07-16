// =============================================================================
// 秦九韶算法 · 录制帧序列
// 演示一个 4 次多项式在某点的 Horner 求值过程；setAux 展示每步累积值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { horner, type HornerHooks } from './impl.ts';

// p(x) = 2x⁴ − 6x³ + 2x² − x + 3，在 x = 3 处求值
export const DEFAULT_INPUT = { coeffs: [2, -6, 2, -1, 3], x: 3 };

/** 录制演示帧序列。 */
export function buildTrace(input: { coeffs: number[]; x: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { coeffs, x } = input;

  const deg = coeffs.length - 1;
  rec
    .begin({
      zh: `求 ${deg} 次多项式在 x = ${x} 处的值（Horner 嵌套求值）`,
      en: `Evaluate degree-${deg} polynomial at x = ${x} (Horner scheme)`,
    })
    .setAux([
      { label: '系数 (降幂)', value: coeffs.join(', '), role: 'pivot' },
      { label: 'x', value: String(x), role: 'pivot' },
    ])
    .commit();

  const history: number[] = [];
  const hooks: HornerHooks = {
    onStep: (step, acc) => {
      history.push(acc);
      const note =
        step === 0
          ? {
              zh: `初始 acc = a_0 = ${coeffs[0]}`,
              en: `Init acc = a_0 = ${coeffs[0]}`,
            }
          : {
              zh: `第 ${step} 步：acc = acc·x + a_${step} = ${history[step - 1]}·${x} + (${coeffs[step]}) = ${acc}`,
              en: `Step ${step}: acc = acc·x + a_${step} = ${history[step - 1]}·${x} + (${coeffs[step]}) = ${acc}`,
            };
      rec
        .begin(note)
        .setBars(
          history.map((v, i) => ({
            value: v,
            role: (i === history.length - 1 ? 'frontier' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: '已处理系数', value: String(step + 1), role: 'compare' },
          { label: '当前 acc', value: String(acc), role: 'frontier' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const result = horner(coeffs, x, hooks);

  rec
    .begin({
      zh: `完成：p(${x}) = ${result}`,
      en: `Done: p(${x}) = ${result}`,
    })
    .setBars(
      history.map((v, i) => ({
        value: v,
        role: (i === history.length - 1 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([{ label: 'p(x)', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
