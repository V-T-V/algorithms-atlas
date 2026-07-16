import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twofishEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = Array.from({ length: 16 }, (_, i) => i + 1);
  rec
    .begin({ zh: 'Twofish', en: 'Twofish' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  twofishEncrypt(key, block, {
    onRound: (r, l, rr) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setAux([
          { label: 'R0', value: l.toString(16), role: 'compare' as BarRole },
          { label: 'R1', value: rr.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
