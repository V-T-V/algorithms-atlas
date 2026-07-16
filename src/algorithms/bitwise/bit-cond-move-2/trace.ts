import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { selectBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[boolean, number, number]> = [
  [true, 0xaa, 0x55],
  [false, 0xaa, 0x55],
];
export function buildTrace(input: Array<[boolean, number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '条件选择', en: 'Conditional select' }).commit();
  for (const [f, a, c] of input) {
    const r = selectBit(f, a, c, {
      onMask: (m) =>
        rec
          .begin({ zh: 'mask = ' + b(m), en: 'mask = ' + b(m) })
          .setAux([{ label: 'mask', value: b(m), role: 'pivot' as BarRole }])
          .commit(),
    });
    rec
      .begin({ zh: (f ? 'a' : 'b') + ' = ' + b(r), en: 'sel = ' + b(r) })
      .setAux([{ label: 'result', value: b(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
