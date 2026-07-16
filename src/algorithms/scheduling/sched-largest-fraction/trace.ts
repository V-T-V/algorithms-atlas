import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { largestFraction, type LfTask } from './impl.ts';

export const DEFAULT_TASKS: LfTask[] = [
  { id: 'A', weight: 3, demand: 6 },
  { id: 'B', weight: 1, demand: 2 },
  { id: 'C', weight: 2, demand: 4 },
];

export function buildTrace(opts: { tasks?: LfTask[] } = {}): Frame[] {
  const tasks = opts.tasks ?? DEFAULT_TASKS;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 ${tasks.length} 进程`, en: `Init ${tasks.length} tasks` })
    .setBars(
      tasks.map((t) => ({
        value: t.weight,
        role: 'default' as BarRole,
        label: `${t.id}:w${t.weight}`,
      })),
    )
    .setAux([{ label: '规则', value: 'deficit最大优先', role: 'compare' as BarRole }])
    .commit();

  largestFraction(tasks, {
    onPick: (id, deficit) => {
      rec
        .begin({
          zh: `${id} 被选 deficit=${deficit.toFixed(2)}`,
          en: `${id} picked deficit=${deficit.toFixed(2)}`,
        })
        .setBars(
          tasks.map((t) => ({
            value: t.weight,
            role: (t.id === id ? 'final' : 'default') as BarRole,
            label: t.id,
          })),
        )
        .setAux([{ label: 'deficit', value: deficit.toFixed(2), role: 'compare' as BarRole }])
        .commit();
    },
  });

  const res = largestFraction(tasks);
  rec
    .begin({ zh: `完成：${res.order.length} 步`, en: `Done: ${res.order.length} steps` })
    .setAux(
      Object.entries(res.allocation).map(([k, v]) => ({
        label: k,
        value: String(v),
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
