import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulatePerCpu } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Per-CPU 计数器', en: 'Per-CPU counter' }).commit();
  simulatePerCpu(
    3,
    [
      { cpu: 0, action: 'inc' },
      { cpu: 1, action: 'inc' },
      { cpu: 2, action: 'inc', delta: 5 },
      { cpu: -1, action: 'sum' },
    ],
    {
      onInc: (cpu, total) =>
        rec
          .begin({ zh: `CPU${cpu} +=1 → total ${total}`, en: `CPU${cpu} +=1 → total ${total}` })
          .setBars(
            [0, 1, 2].map((c) => ({ value: 0, role: 'default' as BarRole, label: 'cpu' + c })),
          )
          .commit(),
      onSum: (t) =>
        rec
          .begin({ zh: `sum = ${t}`, en: `sum = ${t}` })
          .setAux([{ label: 'sum', value: String(t), role: 'final' as BarRole }])
          .commit(),
    },
  );
  return rec.build();
}
