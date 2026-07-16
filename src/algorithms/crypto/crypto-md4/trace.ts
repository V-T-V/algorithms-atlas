import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { md4 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('abc', (c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'MD4', en: 'MD4' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  md4(data, {
    onResult: (h) =>
      rec
        .begin({ zh: '哈希', en: 'hash' })
        .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
