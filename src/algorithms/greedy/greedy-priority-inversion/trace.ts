import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityInheritance } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tasks = [
    { id: 0, prio: 1, holds: 5 },
    { id: 1, prio: 3 },
    { id: 2, prio: 5, waits: 5 },
  ];
  rec
    .begin({ zh: '优先级继承', en: 'Priority inheritance' })
    .setBars(tasks.map((t) => ({ value: t.prio, role: 'default' as BarRole })))
    .commit();
  priorityInheritance(tasks, {
    onBoost: (t, from, to) =>
      rec
        .begin({ zh: `任务${t} 升 ${from}->${to}`, en: `task${t} boost ${from}->${to}` })
        .setBars([{ value: to, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '提升后优先级', en: 'after boost' })
    .setBars(tasks.map((t) => ({ value: t.prio, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
