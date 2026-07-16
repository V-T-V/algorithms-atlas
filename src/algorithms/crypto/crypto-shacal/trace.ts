import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shacal1Encrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 64 }, (_, i) => i + 1);
  const block = Array.from({ length: 20 }, (_, i) => i + 1);
  rec
    .begin({ zh: 'SHACAL-1', en: 'SHACAL-1' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  shacal1Encrypt(key, block, {
    onRound: (r, a, b, c, d, e) => {
      if (r % 20 === 0)
        rec
          .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
          .setAux([
            { label: 'A', value: a.toString(16), role: 'compare' as BarRole },
            { label: 'E', value: e.toString(16), role: 'final' as BarRole },
          ])
          .commit();
    },
  });
  return rec.build();
}
