import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PubSub } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const ps = new PubSub({
    onPublish: (t, m) =>
      rec
        .begin({ zh: `publish ${t}`, en: `publish ${t}` })
        .setAux([{ label: 'msg', value: String(m), role: 'compare' as BarRole }])
        .commit(),
    onDeliver: (t, id) =>
      rec
        .begin({ zh: `deliver ${t}→#${id}`, en: '' })
        .setAux([{ label: 'sub', value: String(id), role: 'final' as BarRole }])
        .commit(),
  });
  ps.subscribe('news', () => {});
  ps.subscribe('news', () => {});
  ps.publish('news', 'hello');
  return rec.build();
}
