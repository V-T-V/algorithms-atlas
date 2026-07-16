import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { computeMetrics, type Job, type Segment } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 0, burst: 2 },
  ] as Job[],
  segments: [
    { id: 'A', start: 0, end: 3 },
    { id: 'B', start: 3, end: 5 },
  ] as Segment[],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '调度指标', en: 'Metrics' }).commit();
  const ms = computeMetrics(input.jobs, input.segments, {
    onMetric: (m) =>
      rec
        .begin({
          zh: m.id + ': 等' + m.wait + ' 转' + m.turnaround,
          en: m.id + ': w' + m.wait + ' t' + m.turnaround,
        })
        .setBars([{ value: m.wait, role: 'pivot' as BarRole, label: m.id }])
        .commit(),
  });
  const avgW = ms.reduce((s, m) => s + m.wait, 0) / ms.length;
  rec
    .begin({ zh: '平均等待 ' + avgW.toFixed(2), en: 'avg wait ' + avgW.toFixed(2) })
    .setAux([{ label: 'avgWait', value: avgW.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
