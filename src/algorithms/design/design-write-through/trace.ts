import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WriteThroughCache } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = new WriteThroughCache<string, number>({
    onWrite: (k) =>
      rec
        .begin({ zh: `write ${k} → cache+db`, en: '' })
        .setAux([{ label: 'write', value: k, role: 'compare' as BarRole }])
        .commit(),
    onRead: (k, hit) =>
      rec
        .begin({ zh: `read ${k} ${hit ? 'hit' : 'miss'}`, en: '' })
        .setAux([
          { label: hit ? 'hit' : 'miss', value: k, role: hit ? 'final' : ('warn' as BarRole) },
        ])
        .commit(),
  });
  c.write('a', 1);
  c.read('a');
  c.read('b');
  return rec.build();
}
