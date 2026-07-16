import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gostEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x12, 0x34, 0x56, 0x78];
  rec
    .begin({ zh: 'GOST 28147', en: 'GOST 28147' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  gostEncrypt(key, block, {
    onRound: (r, l, rr) => {
      if (r % 4 === 0)
        rec
          .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
          .setAux([
            { label: 'L', value: l.toString(16), role: 'compare' as BarRole },
            { label: 'R', value: rr.toString(16), role: 'final' as BarRole },
          ])
          .commit();
    },
  });
  return rec.build();
}
