import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pairingHeapSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '配对堆选择 k=5', en: 'pairing-heap select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  pairingHeapSelect(data, 5, {
    onPop: (v, kk) =>
      rec
        .begin({ zh: `pop #${kk}: ${v}`, en: `pop #${kk}: ${v}` })
        .setAux([{ label: 'pop', value: String(v), role: 'swap' as BarRole }])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `第 5 小=${v}`, en: `5th=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
