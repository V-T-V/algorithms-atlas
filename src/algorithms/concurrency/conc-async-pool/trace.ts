import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { asyncTaskPool } from './impl.ts';
export const DEFAULT_INPUT = { tasks: [0, 1, 2, 3, 4], max: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '异步池 max=' + input.max, en: 'Pool max=' + input.max }).commit();
  const order = asyncTaskPool(input.tasks, input.max, {
    onRun: (i, a) =>
      rec
        .begin({ zh: '运行 T' + i + ' active=' + a, en: 'run' })
        .setAux([{ label: 'active', value: String(a), role: 'compare' as BarRole }])
        .commit(),
    onQueue: (i) =>
      rec
        .begin({ zh: '排队 T' + i, en: 'queue' })
        .setAux([{ label: 'queue', value: 'T' + i, role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '运行顺序 [' + order.join(',') + ']', en: 'order' })
    .setAux([{ label: 'order', value: order.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
