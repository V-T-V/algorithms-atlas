import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exchanger } from './impl.ts';
export const DEFAULT_INPUT = { a: [1, 2, 3], b: [9, 8, 7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Exchanger', en: 'Exchanger' }).commit();
  const { a, b } = exchanger([...input.a], [...input.b], {
    onSwap: (x, y) =>
      rec
        .begin({ zh: '交换 ' + x + ' <-> ' + y, en: 'swap' })
        .setAux([
          { label: 'a', value: String(x), role: 'compare' as BarRole },
          { label: 'b', value: String(y), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: 'a=[' + a.join(',') + '] b=[' + b.join(',') + ']', en: 'result' })
    .setAux([{ label: 'a', value: a.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
