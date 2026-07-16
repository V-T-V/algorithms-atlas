import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findItinerary } from './impl.ts';
export const DEFAULT_INPUT: Array<[string, string]> = [
  ['MUC', 'LHR'],
  ['JFK', 'MUC'],
  ['SFO', 'SJC'],
  ['LHR', 'SFO'],
];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '重建行程', en: 'Reconstruct itinerary' }).commit();
  const path = findItinerary(input, {
    onVisit: (f, t) =>
      rec
        .begin({ zh: f + ' → ' + t, en: f + ' → ' + t })
        .setAux([{ label: 'edge', value: f + '→' + t, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '行程：' + path.join(' → '), en: 'Path: ' + path.join(' → ') })
    .setBars(path.map((p, i) => ({ value: i, role: 'final' as BarRole, label: p })))
    .commit();
  return rec.build();
}
