// 贝叶斯优化 EI · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { optBayesEi, demoObjective } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝叶斯优化 EI', en: 'Bayesian Optimization EI' }).commit();
  const r = optBayesEi(
    demoObjective,
    { maxIter: 8 },
    {
      onIter: (it, x, y, best) =>
        rec
          .begin({ zh: `iter ${it}: x=${x} best=${best.toFixed(2)}`, en: `iter ${it}` })
          .setAux([{ label: 'best', value: best.toFixed(2), role: 'final' as BarRole }])
          .commit(),
    },
  );
  rec
    .begin({ zh: `最优 x=${r.bestX}`, en: `Best x=${r.bestX}` })
    .setAux([{ label: 'bestX', value: String(r.bestX), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
