import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WriteBehindCache } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const c = new WriteBehindCache<string, number>({
    onWriteCache: (k) =>
      rec
        .begin({ zh: `write cache ${k}`, en: '' })
        .setAux([{ label: 'write', value: k, role: 'compare' as BarRole }])
        .commit(),
    onFlush: (k) =>
      rec
        .begin({ zh: `flush ${k} → db`, en: '' })
        .setAux([{ label: 'flush', value: k, role: 'final' as BarRole }])
        .commit(),
  });
  c.write('a', 1);
  c.write('b', 2);
  void c.flush(async () => {});
  return rec.build();
}
