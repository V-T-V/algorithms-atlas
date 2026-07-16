import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { introselect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: 'Introselect k=5', en: 'introselect k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  introselect(data, 5, 3, {
    onPivot: (p, mode) =>
      rec
        .begin({ zh: `pivot=${p} (${mode})`, en: `pivot=${p} (${mode})` })
        .setAux([
          { label: mode, value: String(p), role: mode === 'mom' ? 'warn' : ('compare' as BarRole) },
        ])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `第 5 小=${v}`, en: `5th=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
