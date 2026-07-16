import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { toGray } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2).padStart(4, '0');
export const DEFAULT_INPUT = [0, 1, 2, 3, 4, 5, 6, 7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '二进制→格雷码', en: 'Binary to Gray' }).commit();
  for (const x of input) {
    const g = toGray(x);
    rec
      .begin({ zh: b(x) + ' → ' + b(g), en: b(x) + ' → ' + b(g) })
      .setAux([
        { label: 'bin', value: b(x), role: 'pivot' as BarRole },
        { label: 'gray', value: b(g), role: 'final' as BarRole },
      ])
      .commit();
  }
  return rec.build();
}
