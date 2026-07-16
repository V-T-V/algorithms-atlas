import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { scheduleAffinity, type AffinityTask } from './impl.ts';

export const DEFAULT_TASKS: AffinityTask[] = [
  { id: 'T1', load: 3, homeCore: 0 },
  { id: 'T2', load: 4, homeCore: 0 },
  { id: 'T3', load: 2, homeCore: 1 },
  { id: 'T4', load: 5, homeCore: 0 },
  { id: 'T5', load: 1, homeCore: 1 },
];
export const DEFAULT_NCORES = 2;

export function buildTrace(opts: { tasks?: AffinityTask[]; nCores?: number } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const nCores = opts.nCores ?? DEFAULT_NCORES;
  const rec = new TraceRecorder();
  const coreLoads = new Array(nCores).fill(0);
  let migrations = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        coreLoads.map((l, c) => ({
          value: l,
          role: (l === Math.max(...coreLoads) ? 'warn' : 'final') as BarRole,
          label: `核${c}:${l}`,
        })),
      )
      .setAux([
        { label: '各核负载', value: coreLoads.join(','), role: 'compare' as BarRole },
        { label: '迁移数', value: migrations.toString(), role: 'warn' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始 ${nCores} 核`, en: `Init ${nCores} cores` });

  const r = scheduleAffinity(tasks, nCores, 2, {
    onAssign: (id, core, migrated) => {
      if (migrated) migrations++;
      const t = tasks.find((x) => x.id === id)!;
      coreLoads[core]! += t.load;
      snap({
        zh: `${id} → 核${core}${migrated ? '（迁移）' : ''}`,
        en: `${id} → core${core}${migrated ? ' (migrated)' : ''}`,
      });
    },
  });

  rec
    .begin({ zh: `完成：迁移 ${r.migrations} 次`, en: `Done: ${r.migrations} migrations` })
    .setBars(r.coreLoads.map((l) => ({ value: l, role: 'final' as BarRole, label: String(l) })))
    .setAux([{ label: '结果', value: `负载 ${r.coreLoads.join(',')}`, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
