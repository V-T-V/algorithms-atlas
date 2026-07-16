import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { QueryBuilder } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  new QueryBuilder({
    onSet: (f, v) =>
      rec
        .begin({ zh: `set ${f}`, en: `set ${f}` })
        .setAux([{ label: f, value: String(v), role: 'compare' as BarRole }])
        .commit(),
    onBuild: (q) =>
      rec
        .begin({ zh: 'build', en: 'build' })
        .setAux([
          { label: 'table', value: q.table, role: 'final' as BarRole },
          { label: 'cols', value: q.columns.join(','), role: 'final' as BarRole },
        ])
        .commit(),
  })
    .from('users')
    .select('id', 'name')
    .where('age > 18')
    .limit(10)
    .build();
  return rec.build();
}
