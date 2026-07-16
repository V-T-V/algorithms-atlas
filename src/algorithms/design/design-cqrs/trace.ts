import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CqrsStore } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = new CqrsStore<{ id: string; v: number }>({
    onCommand: (t) =>
      rec
        .begin({ zh: `cmd ${t}`, en: `cmd ${t}` })
        .setAux([{ label: 'cmd', value: t, role: 'compare' as BarRole }])
        .commit(),
    onQuery: (t) =>
      rec
        .begin({ zh: `query ${t}`, en: `query ${t}` })
        .setAux([{ label: 'query', value: t, role: 'final' as BarRole }])
        .commit(),
  });
  s.executeCreate({ id: '1', v: 10 });
  s.executeUpdate('1', { v: 20 });
  s.queryById('1');
  s.queryAll();
  return rec.build();
}
