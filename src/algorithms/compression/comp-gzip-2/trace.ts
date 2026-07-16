import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gzipWrap } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'hellohello';
  rec.begin({ zh: 'gzip 包装', en: 'gzip wrap' }).commit();
  const r = gzipWrap(input, 8, {
    onHeader: (h) =>
      rec
        .begin({ zh: `头部 10 字节`, en: `header 10 bytes` })
        .setBars(h.map((b) => ({ value: b, role: 'compare' as BarRole })))
        .commit(),
    onCrc: (crc) =>
      rec
        .begin({ zh: `CRC32=${crc.toString(16)}`, en: `CRC32=${crc.toString(16)}` })
        .setAux([{ label: 'CRC', value: crc.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `完成 size=${r.size}`, en: `done size=${r.size}` })
    .setAux([{ label: 'size', value: String(r.size), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
