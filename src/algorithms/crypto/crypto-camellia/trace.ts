import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { camelliaEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];
  rec
    .begin({ zh: 'Camellia', en: 'Camellia' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  camelliaEncrypt(key, block, {
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
