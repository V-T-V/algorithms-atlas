import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adler32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'Wikipedia';
  rec.begin({ zh: `Adler-32 "${s}"`, en: `Adler-32 "${s}"` }).commit();
  const a = adler32(s, {
    onByte: (i, b, s1, s2) =>
      rec
        .begin({ zh: `${b}: s1=${s1} s2=${s2}`, en: `${b}: s1=${s1} s2=${s2}` })
        .setAux([
          { label: 's1', value: String(s1), role: 'pivot' as BarRole },
          { label: 's2', value: String(s2), role: 'pivot' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: `adler=0x${a.toString(16)}`, en: `adler=0x${a.toString(16)}` })
    .setAux([{ label: 'adler', value: '0x' + a.toString(16), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
