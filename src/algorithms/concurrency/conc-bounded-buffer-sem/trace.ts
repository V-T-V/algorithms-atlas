import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boundedBufferSem } from './impl.ts';
export const DEFAULT_INPUT: any = {
  cap: 2,
  ops: [
    { op: 'p', v: 1 },
    { op: 'p', v: 2 },
    { op: 'c' },
    { op: 'p', v: 3 },
    { op: 'c' },
    { op: 'c' },
  ],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '信号量有界缓冲 cap=' + input.cap, en: 'Bounded Buffer' }).commit();
  const { buffer } = boundedBufferSem(input.cap, input.ops, {
    onProduce: (v, s) =>
      rec
        .begin({ zh: '生产 ' + v + ' size=' + s, en: 'produce' })
        .setAux([
          { label: 'v', value: String(v), role: 'compare' as BarRole },
          { label: 'size', value: String(s), role: 'pivot' as BarRole },
        ])
        .commit(),
    onConsume: (v, s) =>
      rec
        .begin({ zh: '消费 ' + v + ' size=' + s, en: 'consume' })
        .setAux([{ label: 'v', value: String(v), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '剩余 [' + buffer.join(',') + ']', en: 'remain' })
    .setAux([{ label: 'remain', value: buffer.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
