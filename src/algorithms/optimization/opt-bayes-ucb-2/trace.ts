// 贝叶斯优化 UCB · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optBayesUcb2, demoObjective } from './impl.ts';
export const DEFAULT_INPUT = { maxIter: 8 };
export function buildTrace(input: { maxIter?: number } = {}): Frame[] {
  const { maxIter = 8 } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝叶斯优化 UCB', en: 'Bayesian Optimization UCB' }).commit();
  const r = optBayesUcb2(
    demoObjective,
    { maxIter, candidates: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    {
      onIter: (it, x, y, best) =>
        rec
          .begin({
            zh: `iter ${it}: 采样 x=${x}, y=${y.toFixed(2)}, best=${best.toFixed(2)}`,
            en: `iter ${it}: x=${x} y=${y.toFixed(2)} best=${best.toFixed(2)}`,
          })
          .setAux([{ label: 'best', value: best.toFixed(2), role: 'final' as BarRole }])
          .commit(),
    },
  );
  rec
    .begin({
      zh: `最优 x=${r.bestX}, y=${r.bestY.toFixed(2)}`,
      en: `Best x=${r.bestX} y=${r.bestY.toFixed(2)}`,
    })
    .setAux([{ label: 'bestX', value: String(r.bestX), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
