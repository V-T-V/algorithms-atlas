import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bnbSearch, type BnbProblem } from './impl.ts';
const P: BnbProblem = {
  items: [
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ],
  capacity: 8,
};
export const DEFAULT_INPUT = P;
export function buildTrace(input: BnbProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分支定界 容量8', en: 'B&B cap=8' }).commit();
  const best = bnbSearch(input, {
    onBind: (b) =>
      rec
        .begin({ zh: '新最优 ' + b, en: 'best ' + b })
        .setAux([{ label: 'best', value: String(b), role: 'final' as BarRole }])
        .commit(),
    onPrune: (n, bd) =>
      rec
        .begin({ zh: '剪枝 item' + n + ' bound' + bd.toFixed(1), en: 'prune' })
        .setAux([{ label: 'pruned', value: 'item' + n, role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最优值 ' + best, en: 'optimal ' + best })
    .setAux([{ label: 'opt', value: String(best), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
