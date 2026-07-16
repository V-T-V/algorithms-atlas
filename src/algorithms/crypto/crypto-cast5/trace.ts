import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cast5Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80];
  rec
    .begin({ zh: 'CAST-5', en: 'CAST-5' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  cast5Encrypt(key, block, {
    onRound: (r, type, l, rr) =>
      rec
        .begin({ zh: `第 ${r} 轮 T${type}`, en: `round ${r} T${type}` })
        .setAux([
          { label: 'L', value: l.toString(16), role: 'compare' as BarRole },
          { label: 'R', value: rr.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
