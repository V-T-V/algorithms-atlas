import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crc32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = '123456789';
  rec.begin({ zh: `CRC32 "${s}"`, en: `CRC32 "${s}"` }).commit();
  const c = crc32(s, {
    onConclude: (crc) =>
      rec
        .begin({ zh: `CRC=0x${crc.toString(16)}`, en: `CRC=0x${crc.toString(16)}` })
        .setAux([{ label: 'crc', value: '0x' + crc.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  void c;
  return rec.build();
}
