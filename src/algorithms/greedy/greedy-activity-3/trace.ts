// 活动选择 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyActivity3, type Activity } from './impl.ts';
const ACTS: Activity[] = [
  { name: 'A', start: 1, finish: 4 },
  { name: 'B', start: 3, finish: 5 },
  { name: 'C', start: 0, finish: 6 },
  { name: 'D', start: 5, finish: 7 },
  { name: 'E', start: 8, finish: 9 },
  { name: 'F', start: 5, finish: 9 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '活动选择：按 finish 升序', en: 'Activity selection: ascending finish' })
    .commit();
  const r = greedyActivity3(ACTS, {
    onPick: (a) =>
      rec
        .begin({ zh: `选 ${a.name} [${a.start},${a.finish})`, en: `Pick ${a.name}` })
        .setBars([{ value: a.finish, role: 'final' as BarRole, label: a.name }])
        .commit(),
    onSkip: (a) =>
      rec
        .begin({ zh: `跳 ${a.name}`, en: `Skip ${a.name}` })
        .setBars([{ value: a.finish, role: 'warn' as BarRole, label: a.name }])
        .commit(),
  });
  rec
    .begin({ zh: `选了 ${r.count} 个`, en: `Picked ${r.count}` })
    .setAux([{ label: '数量', value: String(r.count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
