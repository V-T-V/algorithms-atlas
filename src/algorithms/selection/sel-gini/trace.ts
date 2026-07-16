import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gini } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [1, 1, 1, 1, 1, 100]; // 极不均
  rec
    .begin({ zh: 'Gini', en: 'Gini' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  gini(data, {
    onSorted: (s) =>
      rec
        .begin({ zh: `排序`, en: `sorted` })
        .setBars(s.map((v) => ({ value: v, role: 'default' as BarRole })))
        .commit(),
    onResult: (g) =>
      rec
        .begin({ zh: `Gini=${g.toFixed(3)}`, en: `Gini=${g.toFixed(3)}` })
        .setAux([{ label: 'Gini', value: g.toFixed(3), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
