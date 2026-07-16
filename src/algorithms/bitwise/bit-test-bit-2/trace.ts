import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { testBit } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);
export const DEFAULT_INPUT: Array<[number, number]> = [
  [0b1010, 1],
  [0b1010, 0],
  [0xff, 3],
  [0, 4],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '测试位', en: 'Test bit' }).commit();
  for (const [x, i] of input) {
    const r = testBit(x, i);
    rec
      .begin({
        zh: 'bit ' + i + ' of ' + b(x) + ' = ' + r,
        en: 'bit ' + i + ' of ' + b(x) + ' = ' + r,
      })
      .setAux([{ label: 'bit' + i, value: String(r), role: 'final' as BarRole }])
      .commit();
  }
  return rec.build();
}
