import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { md2 } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = Array.from('hello', (c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'MD2', en: 'MD2' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  md2(data, {
    onUpdate: (r, x) =>
      rec
        .begin({ zh: `块 ${r}`, en: `block ${r}` })
        .setBars(x.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit(),
    onResult: (h) =>
      rec
        .begin({ zh: '哈希', en: 'hash' })
        .setBars(h.map((v) => ({ value: v, role: 'final' as BarRole })))
        .commit(),
  });
  return rec.build();
}
