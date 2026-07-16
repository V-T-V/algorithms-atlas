import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reverseNibble } from './impl.ts';
const b = (n: number): string => (n & 0xf).toString(2).padStart(4, '0');
export const DEFAULT_INPUT = [0, 1, 5, 10, 15];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '4位反转', en: 'Nibble reversal' }).commit();
  for (const x of input) {
    const r = reverseNibble(x, {
      onStep: (v) =>
        rec
          .begin({ zh: '中间 = ' + b(v), en: 'mid = ' + b(v) })
          .setAux([{ label: 'mid', value: b(v), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: b(x) + ' → ' + b(r), en: b(x) + ' → ' + b(r) })
      .setAux([{ label: '结果', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
