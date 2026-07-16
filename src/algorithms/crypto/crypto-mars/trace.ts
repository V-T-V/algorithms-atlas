import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { marsEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0x01, 0x02, 0x03, 0x04];
  const block = Array.from({ length: 16 }, (_, i) => i + 1);
  rec
    .begin({ zh: 'MARS', en: 'MARS' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  marsEncrypt(key, block, {
    onRound: (r, v) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setAux([{ label: 'D', value: v.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  return rec.build();
}
