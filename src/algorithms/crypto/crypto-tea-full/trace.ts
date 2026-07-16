import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { teaEncrypt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const key = Array.from({ length: 16 }, (_, i) => i + 1);
  const block = [0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef];
  rec
    .begin({ zh: 'TEA 完整版', en: 'TEA full' })
    .setBars(block.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  teaEncrypt(key, block, {
    onRound: (r, v0, v1) => {
      if (r % 8 === 0)
        rec
          .begin({ zh: `第 ${r} 轮`, en: `round ${r}` })
          .setAux([
            { label: 'v0', value: v0.toString(16), role: 'compare' as BarRole },
            { label: 'v1', value: v1.toString(16), role: 'final' as BarRole },
          ])
          .commit();
    },
  });
  return rec.build();
}
