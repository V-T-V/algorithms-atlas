// 队列重建 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyQueue2, type Person } from './impl.ts';
const P: Person[] = [
  { h: 7, k: 0 },
  { h: 4, k: 4 },
  { h: 7, k: 1 },
  { h: 5, k: 0 },
  { h: 6, k: 1 },
  { h: 5, k: 2 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '队列重建', en: 'Queue reconstruction' }).commit();
  const queue: Person[] = [];
  greedyQueue2(P, {
    onInsert: (i, p) => {
      queue.splice(i, 0, p);
      rec
        .begin({ zh: `[${p.h},${p.k}] 插到 ${i}`, en: `[${p.h},${p.k}] → ${i}` })
        .setBars(
          queue.map((q) => ({ value: q.h, role: 'final' as BarRole, label: `[${q.h},${q.k}]` })),
        )
        .commit();
    },
  });
  const r = greedyQueue2(P);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(
      r.queue.map((q) => ({ value: q.h, role: 'final' as BarRole, label: `[${q.h},${q.k}]` })),
    )
    .commit();
  return rec.build();
}
