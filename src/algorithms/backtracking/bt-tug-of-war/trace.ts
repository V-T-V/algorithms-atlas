import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tugOfWar } from './impl.ts';
export const DEFAULT_INPUT = [23, 45, -34, 12, 0, 98, -99, 4, 189, -1, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '拔河 [' + input.join(',') + ']', en: 'Tug of war' }).commit();
  const d = tugOfWar(input, {
    onImprove: (diff) =>
      rec
        .begin({ zh: '更优差 = ' + diff, en: 'better diff = ' + diff })
        .setAux([{ label: 'diff', value: String(diff), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最小差 = ' + d, en: 'min diff = ' + d })
    .setAux([{ label: 'min', value: String(d), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
