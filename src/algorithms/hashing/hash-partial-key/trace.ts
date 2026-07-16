import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partialKeyHash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [0x12345678, 0x1234abcd, 0x87654321, 0xabcd1234];
  rec.begin({ zh: '部分键哈希 mask=0x00ff00ff', en: 'Partial key hash mask=0x00ff00ff' }).commit();
  partialKeyHash(keys, 0x00ff00ff, {
    onKey: (k, f, h) =>
      rec
        .begin({
          zh: `key=0x${k.toString(16)} -> 0x${h.toString(16)}`,
          en: `key=0x${k.toString(16)} -> 0x${h.toString(16)}`,
        })
        .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
