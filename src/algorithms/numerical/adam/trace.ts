// =============================================================================
// 亚当斯法 · 录制帧序列
// 演示用 AB2 预测-校正求解 y' = y, y(0)=1（真解 e^t）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adam, type AdamsHooks } from './impl.ts';

export const DEFAULT_INPUT = { t0: 0, y0: 1, h: 0.2, n: 10 };

/** 录制演示帧序列。 */
export function buildTrace(
  input: { t0: number; y0: number; h: number; n: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { t0, y0, h, n } = input;
  const f = (_t: number, y: number) => y; // y' = y
  const trueSol = (t: number) => y0 * Math.exp(t - t0);

  rec
    .begin({
      zh: `亚当斯预测-校正法：y' = y, y(0)=${y0}，步长 h=${h}，共 ${n} 步`,
      en: `Adams predictor-corrector: y' = y, y(0)=${y0}, step h=${h}, ${n} steps`,
    })
    .setAux([
      { label: '预测', value: 'AB2: y + h/2·(3f_n − f_{n−1})', role: 'pivot' },
      { label: '校正', value: '梯形: y + h/2·(f_n + f(t_{n+1}, y^P))', role: 'pivot' },
    ])
    .commit();

  const ys: number[] = [y0];
  const hooks: AdamsHooks = {
    onStep: ({ i, t, y, predicted, corrected }) => {
      ys.push(corrected);
      rec
        .begin({
          zh: `第 ${i + 1} 步：t=${t.toFixed(2)}, y=${y.toFixed(5)} → 预测 ${predicted.toFixed(5)} → 校正 ${corrected.toFixed(5)}`,
          en: `Step ${i + 1}: t=${t.toFixed(2)}, y=${y.toFixed(5)} → predict ${predicted.toFixed(5)} → correct ${corrected.toFixed(5)}`,
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
          { label: `预测 y^P`, value: predicted.toFixed(6), role: 'frontier' },
          { label: `校正 y`, value: corrected.toFixed(6), role: 'frontier' },
          { label: `真值`, value: trueSol(t).toFixed(6), role: 'compare' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const result = adam(f, t0, y0, h, n, hooks);

  rec
    .begin({
      zh: `完成：y(${result.ts[result.ts.length - 1]!.toFixed(2)}) ≈ ${result.ys[result.ys.length - 1]!.toFixed(6)}（真值 ≈ ${trueSol(result.ts[result.ts.length - 1]!).toFixed(6)}）`,
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
