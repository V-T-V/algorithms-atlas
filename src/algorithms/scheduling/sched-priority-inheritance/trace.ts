import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityInheritance, type PiJob } from './impl.ts';
export const DEFAULT_INPUT = {
  jobs: [
    { id: 'L', arrival: 0, burst: 1, priority: 5, holding: ['R'] },
    { id: 'H', arrival: 0, burst: 1, priority: 1, holding: [] },
  ] as PiJob[],
  blocked: new Map([['H', 'R']]),
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '优先级继承', en: 'Priority inheritance' }).commit();
  const eff = priorityInheritance(input.jobs, input.blocked, {
    onInherit: (id, np) =>
      rec
        .begin({ zh: id + ' 继承 P=' + np, en: id + ' inherit P=' + np })
        .setAux([{ label: 'newPri', value: String(np), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars([...eff.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k })))
    .commit();
  return rec.build();
}
