import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { whirlpool } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('hello', (c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'Whirlpool（简化）', en: 'Whirlpool (simplified)' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  whirlpool(data, {
    onResult: (h) =>
      rec
        .begin({ zh: '哈希', en: 'hash' })
        .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
