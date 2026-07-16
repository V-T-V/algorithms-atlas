// 区间调度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyInterval3, type Interval } from './impl.ts';
const IVS: Interval[] = [
  { s: 1, e: 3 },
  { s: 2, e: 5 },
  { s: 4, e: 6 },
  { s: 6, e: 8 },
  { s: 5, e: 9 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '区间调度：按结束时间贪心', en: 'Interval scheduling: greedy by end time' })
    .commit();
  const r = greedyInterval3(IVS, {
    onPick: (i, iv) =>
      rec
        .begin({ zh: `选 [${iv.s},${iv.e})`, en: `Pick [${iv.s},${iv.e})` })
        .setAux([{ label: '选', value: String(i), role: 'final' as BarRole }])
        .commit(),
    onSkip: (i, iv) =>
      rec
        .begin({ zh: `跳过 [${iv.s},${iv.e})`, en: `Skip [${iv.s},${iv.e})` })
        .setAux([{ label: '跳', value: String(i), role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `最多 ${r.count} 个`, en: `Max ${r.count} intervals` })
    .setAux([{ label: '数量', value: String(r.count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
