import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sipHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'siphash-test';
  rec.begin({ zh: `SipHash "${s}"`, en: `SipHash "${s}"` }).commit();
  const h = sipHash(s, [0x11111111, 0x22222222], {
    onConclude: (hh) =>
      rec
        .begin({ zh: `hash=0x${hh.toString(16)}`, en: `hash=0x${hh.toString(16)}` })
        .setAux([{ label: 'hash', value: '0x' + hh.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  void h;
  return rec.build();
}
