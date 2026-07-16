import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rc5Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x23, 0x45, 0x67];
  const block = [0x12, 0x34, 0x56, 0x78];
  rec
    .begin({ zh: 'RC5', en: 'RC5' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  rc5Encrypt(key, block, 4, {
    onRound: (r, a, b) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setAux([
          { label: 'A', value: a.toString(16), role: 'compare' as BarRole },
          { label: 'B', value: b.toString(16), role: 'final' as BarRole },
        ])
        .commit(),
  });
  return rec.build();
}
