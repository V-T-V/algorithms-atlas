import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc6Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = [0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0];
  rec
    .begin({ zh: 'RC6', en: 'RC6' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  rc6Encrypt(key, block, 4, {
    onRound: (rr, a, _b, c, _d) =>
      rec
        .begin({ zh: `第 ${rr} 轮`, en: `round ${rr}` })
        .setAux([
          { label: 'A', value: a.toString(16), role: 'compare' as BarRole },
          { label: 'C', value: c.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
