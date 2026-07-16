import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { readIndicator } from './impl.ts';
export const DEFAULT_INPUT: any = [
  { op: 're', tid: 1 },
  { op: 're', tid: 2 },
  { op: 'w', tid: 0 },
  { op: 'rx', tid: 1 },
  { op: 'rx', tid: 2 },
  { op: 'w', tid: 0 },
];
export function buildTrace(ops = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '读指示器', en: 'Read Indicator' }).commit();
  const r = readIndicator(ops, {
    onReadEnter: (t, a) =>
      rec
        .begin({ zh: 'T' + t + ' 进入读 active=' + a, en: 're' })
        .setAux([{ label: 'active', value: String(a), role: 'compare' as BarRole }])
        .commit(),
    onReadExit: (t, a) =>
      rec
        .begin({ zh: 'T' + t + ' 退出读 active=' + a, en: 'rx' })
        .setAux([{ label: 'active', value: String(a), role: 'final' as BarRole }])
        .commit(),
    onWriterWait: (a) =>
      rec
        .begin({ zh: '写等待 active=' + a, en: 'wait' })
        .setAux([{ label: 'wait', value: 'w', role: 'warn' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '写阻塞 ' + r.writersBlocked, en: 'blocked' })
    .setAux([{ label: 'blocked', value: String(r.writersBlocked), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
