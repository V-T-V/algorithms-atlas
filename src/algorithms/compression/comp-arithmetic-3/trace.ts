import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arithmeticEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'AABA'.split('').map((c) => c.charCodeAt(0));
  // A: [0, 49152), B: [49152, 65536) of total 65536
  const freq = new Map<number, [number, number]>([
    ['A'.charCodeAt(0), [0, 49152]],
    ['B'.charCodeAt(0), [49152, 65536]],
  ]);
  rec
    .begin({ zh: '算术编码', en: 'Arithmetic coding' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  arithmeticEncode(data, freq, {
    onStep: (s, lo, hi) =>
      rec
        .begin({ zh: `'${String.fromCharCode(s)}' → [${lo},${hi}]`, en: '' })
        .setAux([
          { label: 'low', value: String(lo), role: 'compare' as BarRole },
          { label: 'high', value: String(hi), role: 'final' as BarRole },
        ])
        .commit(),
    onResult: (lo, hi) =>
      rec
        .begin({ zh: `结果 [${lo},${hi}]`, en: `result [${lo},${hi}]` })
        .setAux([{ label: 'interval', value: `${lo}..${hi}`, role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
