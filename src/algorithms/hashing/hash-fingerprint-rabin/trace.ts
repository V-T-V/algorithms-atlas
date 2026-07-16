import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinFingerprint } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'rabin';
  rec.begin({ zh: `Rabin 指纹 "${s}"`, en: `Rabin fp "${s}"` }).commit();
  const fp = rabinFingerprint(s, {
    onByte: (i, b, f) =>
      rec
        .begin({ zh: `${b}: 0x${f.toString(16)}`, en: `${b}: 0x${f.toString(16)}` })
        .setAux([{ label: 'fp', value: '0x' + f.toString(16), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `fp=0x${fp.toString(16)}`, en: `fp=0x${fp.toString(16)}` })
    .setAux([{ label: 'fp', value: '0x' + fp.toString(16), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
