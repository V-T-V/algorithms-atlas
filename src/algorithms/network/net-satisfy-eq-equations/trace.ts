import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { equationsPossible } from './impl.ts';
export const DEFAULT_INPUT = ['a==b', 'b!=a'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '等式方程可满足', en: 'Equations satisfiability' }).commit();
  const ok = equationsPossible(input, {
    onUnion: (a, b) =>
      rec
        .begin({ zh: 'union ' + a + '=' + b, en: 'union ' + a + '=' + b })
        .setAux([{ label: 'union', value: a + ',' + b, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可满足？' + ok, en: 'satisfiable? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
