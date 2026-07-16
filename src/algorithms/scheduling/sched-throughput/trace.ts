import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { throughput, type Job } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 0, burst: 2 },
  ] as Job[],
  total: 5,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '吞吐量', en: 'Throughput' }).commit();
  const t = throughput(input.jobs, input.total, {
    onResult: (tp) =>
      rec
        .begin({
          zh: '完成 ' + input.jobs.length + ' / ' + input.total + ' = ' + tp.toFixed(2),
          en: tp.toFixed(2) + ' proc/unit',
        })
        .setAux([{ label: 'tp', value: tp.toFixed(3), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '吞吐 = ' + t.toFixed(3), en: 'throughput = ' + t.toFixed(3) })
    .setAux([{ label: 'throughput', value: t.toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
