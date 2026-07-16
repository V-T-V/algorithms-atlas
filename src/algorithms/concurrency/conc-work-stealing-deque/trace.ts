import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { workStealingDeque } from './impl.ts';
export const DEFAULT_INPUT: any = {
  workers: [{ deq: [] }, { deq: [] }],
  ops: [
    { op: 'push', tid: 0, v: 1 },
    { op: 'push', tid: 0, v: 2 },
    { op: 'steal', from: 0, to: 1 },
    { op: 'pop', tid: 0 },
  ],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '工作窃取', en: 'Work-Stealing' }).commit();
  workStealingDeque(
    input.workers.map((w: any) => ({ deq: [...w.deq] })),
    input.ops,
    {
      onPush: (t, v) =>
        rec
          .begin({ zh: 'T' + t + ' push ' + v, en: 'push' })
          .setAux([{ label: 'v', value: String(v), role: 'compare' as BarRole }])
          .commit(),
      onPop: (t, v) =>
        rec
          .begin({ zh: 'T' + t + ' pop ' + v, en: 'pop' })
          .setAux([{ label: 'v', value: String(v), role: 'final' as BarRole }])
          .commit(),
      onSteal: (f, to, v) =>
        rec
          .begin({ zh: 'T' + to + ' 从 T' + f + ' 窃 ' + v, en: 'steal' })
          .setAux([{ label: 'steal', value: String(v), role: 'pivot' as BarRole }])
          .commit(),
    },
  );
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
