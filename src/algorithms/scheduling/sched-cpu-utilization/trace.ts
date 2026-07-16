import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cpuUtilization, type Job } from './impl.ts';
export const DEFAULT_INPUT: Job[] = [
  { id: 'A', arrival: 0, burst: 4 },
  { id: 'B', arrival: 2, burst: 3 },
  { id: 'C', arrival: 8, burst: 2 },
];
export function buildTrace(input: Job[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'CPU 利用率', en: 'CPU utilization' }).commit();
  const u = cpuUtilization(input, {
    onCalc: (util, idle) =>
      rec
        .begin({
          zh: 'busy=' + (util * 100).toFixed(0) + '% idle=' + idle,
          en: 'busy=' + (util * 100).toFixed(0) + '%',
        })
        .setAux([{ label: 'idle', value: String(idle), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: '利用率 = ' + (u * 100).toFixed(1) + '%',
      en: 'util = ' + (u * 100).toFixed(1) + '%',
    })
    .setAux([{ label: 'util', value: (u * 100).toFixed(1) + '%', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
