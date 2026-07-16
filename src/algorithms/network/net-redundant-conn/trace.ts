import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findRedundantConnection } from './impl.ts';
export const DEFAULT_INPUT: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [2, 3],
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '冗余连接', en: 'Redundant connection' }).commit();
  const e = findRedundantConnection(input, {
    onCheck: (a, b, cycle) =>
      rec
        .begin({
          zh: a + '-' + b + (cycle ? ' 成环' : ''),
          en: a + '-' + b + (cycle ? ' cycle' : ''),
        })
        .setAux([{ label: 'cycle', value: String(cycle), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '冗余边：' + e.join('-'), en: 'redundant: ' + e.join('-') })
    .setAux([{ label: 'edge', value: e.join('-'), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
