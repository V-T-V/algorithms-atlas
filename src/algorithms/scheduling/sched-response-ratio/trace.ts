import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { responseRatios, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 2 },
    { id: 'B', arrival: 0, burst: 4 },
    { id: 'C', arrival: 0, burst: 8 },
  ] as Job[],
  time: 5,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '响应比 t=' + input.time, en: 'Ratio t=' + input.time }).commit();
  const rs = responseRatios(input.jobs, input.time, {
    onRatio: (id, r) =>
      rec
        .begin({ zh: id + ' R=' + r.toFixed(2), en: id + ' R=' + r.toFixed(2) })
        .setBars([{ value: r, role: 'pivot' as BarRole, label: id }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars([...rs.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k })))
    .commit();
  return rec.build();
}
