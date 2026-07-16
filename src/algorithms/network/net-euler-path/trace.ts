import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerKind, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '欧拉路径判断', en: 'Euler path check' }).commit();
  const k = eulerKind(input, {
    onDegree: (v, d) =>
      rec
        .begin({ zh: '度 ' + v + '=' + d, en: 'deg ' + v + '=' + d })
        .setAux([{ label: v, value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '类型：' + k, en: 'kind: ' + k })
    .setAux([{ label: 'kind', value: k, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
