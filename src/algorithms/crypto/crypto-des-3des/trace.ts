import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { desEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x12, 0x34];
  const block = [0x41, 0x42, 0x43, 0x44];
  rec
    .begin({ zh: 'DES（教学简化）', en: 'DES (teaching)' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  desEncrypt(key, block, {
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
