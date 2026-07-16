import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { seedEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [1, 2, 3, 4, 5, 6, 7, 8];
  rec
    .begin({ zh: 'SEED', en: 'SEED' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  seedEncrypt(key, block, {
    onRound: (r, l, rr) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setAux([
          { label: 'L', value: l.toString(16), role: 'compare' as BarRole },
          { label: 'R', value: rr.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
