import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ideaEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80];
  rec
    .begin({ zh: 'IDEA', en: 'IDEA' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ideaEncrypt(key, block, {
    onRound: (r, vals) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setBars(vals.map((v) => ({ value: v, role: 'compare' as BarRole })))
        .commit(),
  });
  return rec.build();
}
