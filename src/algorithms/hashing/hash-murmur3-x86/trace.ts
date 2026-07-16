import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { murmur3_32 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'MurmurHash3';
  rec.begin({ zh: `Murmur3 "${s}" seed=0`, en: `Murmur3 "${s}" seed=0` }).commit();
  const h = murmur3_32(s, 0, {
    onBlock: (off, k, hh) =>
      rec
        .begin({
          zh: `块@${off} k=0x${k.toString(16)} h=0x${hh.toString(16)}`,
          en: `block@${off} k=0x${k.toString(16)} h=0x${hh.toString(16)}`,
        })
        .setAux([{ label: 'h', value: '0x' + hh.toString(16), role: 'pivot' as BarRole }])
        .commit(),
    onConclude: (hh) =>
      rec
        .begin({ zh: `hash=0x${hh.toString(16)}`, en: `hash=0x${hh.toString(16)}` })
        .setAux([{ label: 'hash', value: '0x' + hh.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  void h;
  return rec.build();
}
