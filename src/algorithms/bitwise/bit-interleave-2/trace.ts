import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { interleave } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0');
export const DEFAULT_INPUT: Array<[number, number]> = [
  [1, 1],
  [3, 3],
  [0, 7],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '位交错', en: 'Bit interleave' }).commit();
  for (const [x, y] of input) {
    const r = interleave(x, y, {
      onSpread: (sx, sy) =>
        rec
          .begin({ zh: 'spread x=' + b(sx) + ' y=' + b(sy), en: 'spread' })
          .setAux([{ label: 'sx', value: b(sx), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({
        zh: 'interleave(' + x + ',' + y + ')=' + r,
        en: 'interleave(' + x + ',' + y + ')=' + r,
      })
      .setAux([{ label: 'morton', value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
