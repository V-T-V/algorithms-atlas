import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HsQueue } from './impl.ts';
export const DEFAULT_INPUT: any = [1, 2, 3, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '半同步半异步', en: 'Half-Sync/Async' }).commit();
  const q = new HsQueue();
  for (const n of input)
    q.enqueue(n, {
      onEnqueue: (x) =>
        rec
          .begin({ zh: '入队 ' + x, en: 'enqueue' })
          .setAux([{ label: 'n', value: String(x), role: 'compare' as BarRole }])
          .commit(),
    });
  const out = q.drainSync({
    onProcess: (x) =>
      rec
        .begin({ zh: '处理 ' + x, en: 'process' })
        .setAux([{ label: 'n', value: String(x), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '[' + out.join(',') + ']', en: 'out' })
    .setAux([{ label: 'out', value: out.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
