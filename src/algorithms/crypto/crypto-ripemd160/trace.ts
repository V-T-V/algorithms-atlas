import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ripemd160 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('abc', (c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'RIPEMD-160', en: 'RIPEMD-160' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ripemd160(data, {
    onResult: (h) =>
      rec
        .begin({ zh: '哈希', en: 'hash' })
        .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
