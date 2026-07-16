import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { networkDelayTime } from './impl.ts';
export const DEFAULT_INPUT = {
  times: [
    [2, 1, 1],
    [2, 3, 1],
    [3, 4, 1],
  ] as Array<[number, number, number]>,
  n: 4,
  k: 2,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '网络延迟 从 ' + input.k, en: 'Network delay from ' + input.k }).commit();
  const t = networkDelayTime(input.times, input.n, input.k, {
    onRelax: (v, d) =>
      rec
        .begin({ zh: '节点 ' + v + ' 延迟 ' + d, en: 'node ' + v + ' delay ' + d })
        .setAux([{ label: 'delay', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '总延迟 = ' + t, en: 'total = ' + t })
    .setAux([{ label: 'total', value: String(t), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
