import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lottery, type LotteryJob } from './impl.ts';
export const DEFAULT_INPUT: LotteryJob[] = [
  { id: 'A', arrival: 0, burst: 3, tickets: 5 },
  { id: 'B', arrival: 0, burst: 2, tickets: 3 },
  { id: 'C', arrival: 0, burst: 1, tickets: 2 },
];
export function buildTrace(input: LotteryJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '彩票调度', en: 'Lottery' }).commit();
  const r = lottery(input, {
    onPick: (j, t) =>
      rec
        .begin({ zh: t + ': 抽中 ' + j.id, en: t + ': ' + j.id })
        .setAux([{ label: 'run', value: j.id, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '平均等待 ' + r.avgWait.toFixed(2), en: 'avg wait ' + r.avgWait.toFixed(2) })
    .setBars(
      r.segments.map((s) => ({ value: s.end - s.start, role: 'final' as BarRole, label: s.id })),
    )
    .setAux([{ label: 'avgWait', value: r.avgWait.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
