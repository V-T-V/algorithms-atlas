import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryStrings } from './impl.ts';
export const DEFAULT_N = 3;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: n + ' 位二进制串', en: n + '-bit strings' }).commit();
  binaryStrings(n, {
    onBit: (idx, b) => {
      cur[idx] = b;
      rec
        .begin({ zh: '位 ' + idx + '=' + b, en: 'bit ' + idx + '=' + b })
        .setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }])
        .commit();
    },
    onResult: (s) =>
      rec
        .begin({ zh: s, en: s })
        .setBars([{ value: parseInt(s, 2), role: 'final' as BarRole, label: s }])
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
