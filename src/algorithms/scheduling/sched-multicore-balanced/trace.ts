import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scheduleMulticoreBalanced, type McTask } from './impl.ts';

export const DEFAULT_TASKS: McTask[] = [
  { id: 'A', duration: 5 },
  { id: 'B', duration: 3 },
  { id: 'C', duration: 8 },
  { id: 'D', duration: 2 },
  { id: 'E', duration: 6 },
  { id: 'F', duration: 4 },
];
export const DEFAULT_NCORES = 3;

export function buildTrace(opts: { tasks?: McTask[]; nCores?: number } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const nCores = opts.nCores ?? DEFAULT_NCORES;
  const rec = new TraceRecorder();
  const coreLoads = new Array(nCores).fill(0);

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        coreLoads.map((l, c) => ({ value: l, role: 'final' as BarRole, label: `核${c}:${l}` })),
      )
      .setAux([{ label: '各核负载', value: coreLoads.join(','), role: 'compare' as BarRole }])
      .commit();
  };

  snap({
    zh: `初始 ${nCores} 核，${tasks.length} 任务`,
    en: `Init ${nCores} cores, ${tasks.length} tasks`,
  });

  scheduleMulticoreBalanced(tasks, nCores, {
    onAssign: (id, core, load) => {
      coreLoads[core]! = load;
      snap({ zh: `${id} → 核${core}`, en: `${id} → core${core}` });
    },
  });

  const r = scheduleMulticoreBalanced(tasks, nCores);
  rec
    .begin({ zh: `完成：makespan=${r.makespan}`, en: `Done: makespan=${r.makespan}` })
    .setBars(r.coreLoads.map((l) => ({ value: l, role: 'final' as BarRole, label: String(l) })))
    .setAux([{ label: 'makespan', value: r.makespan.toString(), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
