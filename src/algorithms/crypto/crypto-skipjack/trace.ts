import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { skipjackEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 10 }, (_, i) => i + 1);
  const block = [1, 2, 3, 4, 5, 6, 7, 8];
  rec
    .begin({ zh: 'Skipjack', en: 'Skipjack' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  skipjackEncrypt(key, block, {
    onRound: (r, w) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setBars(w.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit(),
  });
  return rec.build();
}
