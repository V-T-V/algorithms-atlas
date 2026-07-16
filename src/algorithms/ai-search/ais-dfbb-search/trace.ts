import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dfbbSearch, type DfbbProblem } from './impl.ts';
const P: DfbbProblem = { weights: [2, 3, 4], values: [3, 4, 5], capacity: 5 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: DfbbProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DFB&B', en: 'DFB&B' }).commit();
  const best = dfbbSearch(input, {
    onBind: (b) =>
      rec
        .begin({ zh: '新最优 ' + b, en: 'best ' + b })
        .setAux([{ label: 'best', value: String(b), role: 'final' as BarRole }])
        .commit(),
    onPrune: (c) =>
      rec
        .begin({ zh: '剪枝 cost=' + c, en: 'prune' })
        .setAux([{ label: 'pruned', value: String(c), role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最优 ' + best, en: 'opt ' + best })
    .setAux([{ label: 'opt', value: String(best), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
