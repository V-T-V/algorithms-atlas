import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TssCounter } from './impl.ts';
export const DEFAULT_INPUT: any = [[1], [2], [1], [1], [2], [3]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '线程专属存储', en: 'TSS' }).commit();
  const c = new TssCounter();
  for (const [t] of input)
    c.inc(t!, {
      onAccess: (th, v) =>
        rec
          .begin({ zh: '线程 ' + th + ' 计数 ' + v, en: 'access' })
          .setAux([{ label: 'thread', value: String(th), role: 'compare' as BarRole }])
          .commit(),
    });
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
