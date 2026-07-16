import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { serpentEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = [0xab, 0xcd];
  const block = [0x12, 0x34];
  rec
    .begin({ zh: 'Serpent', en: 'Serpent' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  serpentEncrypt(key, block, {
    onRound: (r, s) =>
      rec
        .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
        .setAux([{ label: 'state', value: s.toString(16), role: 'compare' as BarRole }])
        .commit(),
  });
  return rec.build();
}
