import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { riceBlockEncode } from './impl.ts';
export const DEFAULT_INPUT = { values: [0, 1, 2, 3, 8, 9, 10, 11], blockSize: 4, kMax: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Rice 块编码', en: 'Rice block' }).commit();
  const { k, bits } = riceBlockEncode(input.values, input.blockSize, input.kMax, {
    onBlock: (s, kk, b) =>
      rec
        .begin({ zh: '块@' + s + ' k=' + kk + ' ' + b + '位', en: 'block' })
        .setAux([
          { label: 'k', value: String(kk), role: 'pivot' as BarRole },
          { label: 'bits', value: String(b), role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '总 ' + bits + ' 位', en: bits + ' bits' })
    .setAux([
      { label: 'bits', value: String(bits), role: 'final' as BarRole },
      { label: 'ks', value: k.join(','), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
