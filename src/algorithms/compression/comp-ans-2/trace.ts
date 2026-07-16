import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ansEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = 'ABAB'.split('').map((c) => c.charCodeAt(0));
  const freq = new Map([
    ['A'.charCodeAt(0), { sym: 65, base: 3, cum: 0 }],
    ['B'.charCodeAt(0), { sym: 66, base: 3, cum: 1 }],
  ]);
  rec
    .begin({ zh: 'ANS 综合', en: 'ANS overview' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  ansEncode(data, freq, {
    onEncode: (s, x) =>
      rec
        .begin({ zh: `'${String.fromCharCode(s)}' x=${x}`, en: '' })
        .setAux([{ label: 'x', value: String(x), role: 'final' as BarRole }])
        .commit(),
    onResult: (x) =>
      rec
        .begin({ zh: `最终 x=${x}`, en: `final x=${x}` })
        .setAux([{ label: 'final', value: String(x), role: 'final' as BarRole }])
        .commit(),
  });
  return rec.build();
}
