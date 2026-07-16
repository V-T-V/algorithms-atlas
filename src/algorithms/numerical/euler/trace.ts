// =============================================================================
// 欧拉法 · 录制帧序列
// 演示求解 y' = y, y(0)=1（真解 e^t），展示沿切线推进的过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { euler, type EulerHooks } from './impl.ts';

export const DEFAULT_INPUT = { f: 'exp' as const, t0: 0, y0: 1, h: 0.2, n: 10 };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { f?: 'exp' | 'decay'; t0: number; y0: number; h: number; n: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const choice = input.f ?? 'exp';
  const f = choice === 'decay' ? (_t: number, y: number) => -y : (_t: number, y: number) => y;
  const trueSol =
    choice === 'decay'
      ? (t: number) => input.y0 * Math.exp(-(t - input.t0))
      : (t: number) => input.y0 * Math.exp(t - input.t0);
  const label =
    choice === 'decay'
      ? { zh: "y' = −y, y(0)=1（衰减，真解 e⁻ᵗ）", en: "y' = −y, y(0)=1 (decay, true e⁻ᵗ)" }
      : { zh: "y' = y, y(0)=1（增长，真解 eᵗ）", en: "y' = y, y(0)=1 (growth, true eᵗ)" };

  rec
    .begin({
      zh: `${label.zh}，步长 h = ${input.h}，共 ${input.n} 步`,
      en: `${label.en}, step h = ${input.h}, ${input.n} steps`,
    })
    .setAux([
      { label: '公式', value: 'y_{n+1} = y_n + h·f(t_n, y_n)', role: 'pivot' },
      { label: '初值', value: `t0=${input.t0}, y0=${input.y0}`, role: 'pivot' },
    ])
    .commit();

  const ys: number[] = [input.y0];
  const hooks: EulerHooks = {
    onStep: ({ i, t, y, slope }) => {
      rec
        .begin({
          zh: `第 ${i + 1} 步：t=${t.toFixed(2)}, y=${y.toFixed(4)}, 斜率=${slope.toFixed(4)} → y_next = ${y} + ${input.h}·${slope.toFixed(3)} = ${(y + input.h * slope).toFixed(4)}`,
          en: `Step ${i + 1}: t=${t.toFixed(2)}, y=${y.toFixed(4)}, slope=${slope.toFixed(4)} → y_next = ${(y + input.h * slope).toFixed(4)}`,
        })
        .setBars(
          ys.map((v, k) => ({
            value: v,
            role: (k === ys.length - 1 ? 'frontier' : 'default') as BarRole,
          })),
        )
        .setAux([
          { label: `t_${i}`, value: t.toFixed(4), role: 'pivot' },
          { label: `y_${i}`, value: y.toFixed(6), role: 'compare' },
          { label: `真值 y(t_${i})`, value: trueSol(t).toFixed(6), role: 'compare' },
          { label: `误差`, value: Math.abs(y - trueSol(t)).toExponential(2), role: 'warn' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
      ys.push(y + input.h * slope);
    },
  };

  const result = euler(f, input.t0, input.y0, input.h, input.n, hooks);

  rec
    .begin({
      zh: `完成：最终 y(${result.ts[result.ts.length - 1]!.toFixed(2)}) ≈ ${result.ys[result.ys.length - 1]!.toFixed(6)}（真值 ≈ ${trueSol(result.ts[result.ts.length - 1]!).toFixed(6)}）`,
      en: `Done: y(${result.ts[result.ts.length - 1]!.toFixed(2)}) ≈ ${result.ys[result.ys.length - 1]!.toFixed(6)} (true ≈ ${trueSol(result.ts[result.ts.length - 1]!).toFixed(6)})`,
    })
    .setBars(result.ys.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([
      { label: '近似终值', value: result.ys[result.ys.length - 1]!.toFixed(6), role: 'final' },
      { label: '真值', value: trueSol(result.ts[result.ts.length - 1]!).toFixed(6), role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}
