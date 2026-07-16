import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { iceHashBatch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const keys = [1, 2, 3, 100, 1000];
  rec.begin({ zh: 'ICE 整数哈希', en: 'ICE integer hash' }).commit();
  iceHashBatch(keys, {
    onKey: (k, h) =>
      rec
        .begin({ zh: `${k} -> 0x${h.toString(16)}`, en: `${k} -> 0x${h.toString(16)}` })
        .setAux([{ label: 'hash', value: '0x' + h.toString(16), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
