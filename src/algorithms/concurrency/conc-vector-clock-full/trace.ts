import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vectorClockFull } from './impl.ts';
export const DEFAULT_INPUT: any = {
  n: 2,
  events: [
    { type: 'local', pid: 0 },
    { type: 'send', from: 0, to: 1 },
    { type: 'recv', to: 1, msg: [1, 0] },
  ],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '向量时钟 n=' + input.n, en: 'Vector Clock' }).commit();
  const clocks = vectorClockFull(input.n, input.events, {
    onLocal: (p, c) =>
      rec
        .begin({ zh: 'P' + p + ' 本地 [' + c.join(',') + ']', en: 'local' })
        .setAux([
          { label: 'P', value: 'P' + p, role: 'compare' as BarRole },
          { label: 'clock', value: c.join(','), role: 'final' as BarRole },
        ])
        .commit(),
    onSend: (f, to, m) =>
      rec
        .begin({ zh: 'P' + f + '->P' + to + ' [' + m.join(',') + ']', en: 'send' })
        .setAux([{ label: 'msg', value: m.join(','), role: 'pivot' as BarRole }])
        .commit(),
    onReceive: (to, c) =>
      rec
        .begin({ zh: 'P' + to + ' 收到 [' + c.join(',') + ']', en: 'recv' })
        .setAux([{ label: 'clock', value: c.join(','), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: '终态 P0=[' + clocks[0]!.join(',') + '] P1=[' + clocks[1]!.join(',') + ']',
      en: 'final',
    })
    .setAux([{ label: 'P0', value: clocks[0]!.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
