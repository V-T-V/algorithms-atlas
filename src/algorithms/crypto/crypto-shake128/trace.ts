import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shake128 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('hello', (c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'SHAKE128', en: 'SHAKE128' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  shake128(data, 32, {
    onSqueeze: (out) =>
      rec
        .begin({ zh: '输出', en: 'output' })
        .setBars(out.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
