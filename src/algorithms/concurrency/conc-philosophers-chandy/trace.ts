import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { chandyMisra } from './impl.ts';
export const DEFAULT_INPUT = { n: 3, rounds: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Chandy/Misra n=' + input.n, en: 'CM n=' + input.n }).commit();
  const eat = chandyMisra(input.n, input.rounds, {
    onRequest: (f, from, to) =>
      rec
        .begin({ zh: '叉' + f + ' ' + from + '->' + to, en: 'request' })
        .setAux([{ label: 'fork', value: 'F' + f, role: 'pivot' as BarRole }])
        .commit(),
    onEat: (p) =>
      rec
        .begin({ zh: 'P' + p + ' 进餐', en: 'eat' })
        .setAux([{ label: 'eat', value: 'P' + p, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '进餐 [' + eat.join(',') + ']', en: 'eats' })
    .setAux([{ label: 'eats', value: eat.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
