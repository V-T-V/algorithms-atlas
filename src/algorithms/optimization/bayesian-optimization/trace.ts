// =============================================================================
// 贝叶斯优化 · 录制帧序列
// setBars 展示候选网格上 EI 分布；setAux 展示当前最优与下一步。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  bayesianOptimization,
  demoFunc,
  fitGP,
  expectedImprovement,
  type BOHooks,
  type Observation,
} from './impl.ts';

export const DEFAULT_INPUT = {
  initial: [
    { x: 0.1, fx: demoFunc(0.1) },
    { x: 0.9, fx: demoFunc(0.9) },
  ] as Observation[],
  nEvals: 8,
};

/** 录制演示帧序列。 */
export function buildTrace(input: { initial?: Observation[]; nEvals?: number } = {}): Frame[] {
  const { initial = DEFAULT_INPUT.initial, nEvals = 8 } = input;
  const rec = new TraceRecorder();
  const bounds: [number, number] = [0, 1];
  const nCandidates = 50;

  const renderEI = (
    obs: Observation[],
    note: { zh: string; en: string },
    options: { highlight?: number; bestX?: number } = {},
  ): void => {
    const predict = fitGP(obs, { lengthScale: 0.2, signalVar: 1, noiseVar: 1e-6 });
    const fStar = Math.min(...obs.map((o) => o.fx));
    const xs: number[] = [];
    const eis: number[] = [];
    for (let c = 0; c < nCandidates; c++) {
      const x = bounds[0]! + ((bounds[1]! - bounds[0]!) * c) / (nCandidates - 1);
      const { mean, variance } = predict(x);
      xs.push(x);
      eis.push(expectedImprovement(mean, Math.sqrt(variance), fStar));
    }
    rec
      .begin(note)
      .setBars(
        eis.map((e, i) => ({
          value: e,
          role: (Math.abs(i - (options.highlight ?? -1)) < 1
            ? 'swap'
            : i % 10 === 0
              ? 'compare'
              : 'default') as BarRole,
          label: xs[i]!.toFixed(2),
        })),
      )
      .setAux([
        { label: '观测数', value: String(obs.length), role: 'pivot' as BarRole },
        {
          label: '当前最优 x',
          value: (options.bestX ?? Math.min(...obs.map((o) => o.x))).toFixed(3),
          role: 'final' as BarRole,
        },
        { label: '当前最优 f', value: fStar.toFixed(4), role: 'final' as BarRole },
      ])
      .commit();
  };

  renderEI(initial, {
    zh: `初始观测 ${initial.length} 个`,
    en: `${initial.length} initial observations`,
  });

  const hooks: BOHooks = {
    onStep: (step, iter, obs) => {
      renderEI(
        obs,
        {
          zh: `第 ${step + 1} 步：在 x=${iter.xNext.toFixed(2)} 评估（EI=${iter.eiNext.toFixed(3)}）`,
          en: `Step ${step + 1}: evaluate at x=${iter.xNext.toFixed(2)} (EI=${iter.eiNext.toFixed(3)})`,
        },
        { highlight: Math.round(iter.xNext * (nCandidates - 1)) },
      );
    },
  };

  const result = bayesianOptimization(demoFunc, initial, { nEvals, bounds }, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：最优 x=${result.best.x.toFixed(3)}（f=${result.best.fx.toExponential(2)}），共 ${result.observations.length} 次评估`,
      en: `Done: best x=${result.best.x.toFixed(3)} (f=${result.best.fx.toExponential(2)}), ${result.observations.length} evals`,
    })
    .setAux([
      { label: '最优 x', value: result.best.x.toFixed(4), role: 'final' as BarRole },
      { label: '最优 f', value: result.best.fx.toExponential(3), role: 'final' as BarRole },
      { label: '评估次数', value: String(result.observations.length), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
