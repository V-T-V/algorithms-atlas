import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountRange } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [0, 7],
  [1, 4],
  [5, 5],
];
export function buildTrace(input: Array<[number, number]> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '区间popcount和', en: 'Popcount range sum' }).commit();
  for (const [m, n] of input) {
    const vals: Array<[number, number]> = [];
    const r = popcountRange(m, n, { onValue: (x, c) => vals.push([x, c]) });
    rec
      .begin({
        zh: 'sum pc([' + m + ',' + n + ']) = ' + r,
        en: 'sum pc([' + m + ',' + n + ']) = ' + r,
      })
      .setBars(vals.map(([x, c]) => ({ value: c, role: 'final' as BarRole, label: String(x) })))
      .commit();
  }
  return rec.build();
}
