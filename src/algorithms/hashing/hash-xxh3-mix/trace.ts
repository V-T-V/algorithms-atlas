import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xxh3Mix } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'xxhash3-test';
  rec.begin({ zh: `XXH3 "${s}"`, en: `XXH3 "${s}"` }).commit();
  xxh3Mix(s, 0n, {
    onConclude: (h) =>
      rec
        .begin({ zh: `hash=0x${h.toString(16)}`, en: `hash=0x${h.toString(16)}` })
        .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
