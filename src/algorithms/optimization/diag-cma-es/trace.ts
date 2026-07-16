// =============================================================================
// 对角 CMA-ES · 录制帧序列
// setBars 展示均值各维坐标；setAux 展示 σ、最优值、代数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { diagCMAES, demoFunc, type DiagCMAHooks } from './impl.ts';

export interface DiagCMAInput {
  initMean: number[];
  seed?: number;
}

export const DEFAULT_INPUT: DiagCMAInput = {
  initMean: [5, -5, 3],
  seed: 42,
};

/** 录制演示帧序列。 */
export function buildTrace(input: DiagCMAInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { initMean, seed = 42 } = input;

  const snapshot = (
    note: { zh: string; en: string },
    mean: number[],
    sigma: number,
    best: number,
    gen: number,
  ): void => {
    rec
      .begin(note)
      .setBars(
        mean.map((m, i) => ({
          value: m,
          role: 'compare' as BarRole,
          label: `x${i}`,
        })),
      )
      .setAux([
        { label: '代数', value: String(gen), role: 'pivot' as BarRole },
        { label: 'σ', value: sigma.toExponential(2), role: 'frontier' as BarRole },
        { label: '最优 f', value: best.toExponential(2), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot(
    { zh: `初始均值 [${initMean.join(', ')}]`, en: `Initial mean [${initMean.join(', ')}]` },
    initMean,
    0.5,
    demoFunc(initMean),
    0,
  );

  const hooks: DiagCMAHooks = {
    onGeneration: (gen, mean, sigma, best) => {
      if (gen % 10 === 0 || gen <= 3) {
        snapshot(
          {
            zh: `第 ${gen} 代：σ=${sigma.toExponential(2)}，最优 ${best.toExponential(2)}`,
            en: `Gen ${gen}: σ=${sigma.toExponential(2)}, best ${best.toExponential(2)}`,
          },
          mean,
          sigma,
          best,
          gen,
        );
      }
    },
  };

  const result = diagCMAES(demoFunc, initMean, { maxGenerations: 300, seed }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：均值 [${result.mean.map((m) => m.toFixed(3)).join(', ')}]，${result.generations} 代`
        : `完成：${result.generations} 代`,
      en: result.converged
        ? `Converged: mean [${result.mean.map((m) => m.toFixed(3)).join(', ')}], ${result.generations} gens`
        : `Done: ${result.generations} gens`,
    })
    .setBars(
      result.mean.map((m, i) => ({
        value: m,
        role: 'final' as BarRole,
        label: `x${i}=${m.toFixed(2)}`,
      })),
    )
    .setAux([
      { label: '最优 f', value: result.value.toExponential(3), role: 'final' as BarRole },
      { label: 'σ', value: result.sigma.toExponential(2), role: 'frontier' as BarRole },
      { label: '代数', value: String(result.generations), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
