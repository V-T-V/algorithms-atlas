import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fairShare, type FsJob } from './impl.ts';
export const DEFAULT_INPUT: FsJob[] = [
  { id: 'A', arrival: 0, burst: 2, group: 'X' },
  { id: 'B', arrival: 0, burst: 3, group: 'Y' },
  { id: 'C', arrival: 0, burst: 1, group: 'X' },
];
export function buildTrace(input: FsJob[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '公平分享', en: 'Fair share' }).commit();
  const r = fairShare(input, {
    onPick: (j, t) =>
      rec
        .begin({ zh: t + ': ' + j.id + ' (g' + j.group + ')', en: t + ': ' + j.id })
        .setAux([{ label: 'group', value: j.group, role: 'pivot' as BarRole }])
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
