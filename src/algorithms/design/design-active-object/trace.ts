import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ActiveObject } from './impl.ts';
export const DEFAULT_INPUT: any = ['a', 'b', 'c'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '主动对象', en: 'Active Object' }).commit();
  const ao = new ActiveObject();
  for (const s of input) ao.schedule(() => ao.pushLog(s.toUpperCase()));
  const log = ao.runSync({
    onExec: (i) =>
      rec
        .begin({ zh: '执行 ' + i, en: 'exec' })
        .setAux([{ label: 'i', value: String(i), role: 'compare' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '[' + log.join(',') + ']', en: 'log' })
    .setAux([{ label: 'log', value: log.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
