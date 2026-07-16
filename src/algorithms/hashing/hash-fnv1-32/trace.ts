import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1_32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'hello';
  rec.begin({ zh: `FNV-1-32 "${s}"`, en: `FNV-1-32 "${s}"` }).commit();
  const h = fnv1_32(s, {
    onByte: (i, b, hv) =>
      rec
        .begin({
          zh: `byte[${i}]=${b} h=0x${hv.toString(16)}`,
          en: `byte[${i}]=${b} h=0x${hv.toString(16)}`,
        })
        .setAux([{ label: 'h', value: '0x' + hv.toString(16), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最终 0x${h.toString(16)}`, en: `final 0x${h.toString(16)}` })
    .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
