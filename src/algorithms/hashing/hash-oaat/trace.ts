import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { oaatHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'jenkins';
  rec.begin({ zh: `OAAT "${s}"`, en: `OAAT "${s}"` }).commit();
  oaatHash(s, {
    onByte: (i, b, h) =>
      rec
        .begin({ zh: `${b}: 0x${h.toString(16)}`, en: `${b}: 0x${h.toString(16)}` })
        .setAux([{ label: 'h', value: '0x' + h.toString(16), role: 'pivot' as BarRole }])
        .commit(),
  });
  return rec.build();
}
