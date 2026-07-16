import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildGantt, type Segment } from './impl.ts';
export const DEFAULT_INPUT: Segment[] = [
  { id: 'A', start: 0, end: 3 },
  { id: 'B', start: 3, end: 5 },
];
export function buildTrace(input: Segment[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '甘特图', en: 'Gantt' }).commit();
  const chart = buildGantt(input, {
    onCell: (t, id) =>
      rec
        .begin({ zh: 't' + t + ': ' + id, en: 't' + t + ': ' + id })
        .setAux([{ label: 't', value: String(t), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: chart, en: chart })
    .setBars([{ value: chart.length, role: 'final' as BarRole, label: chart }])
    .commit();
  return rec.build();
}
