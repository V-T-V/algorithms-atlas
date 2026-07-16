import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMatching, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  left: ['L1', 'L2', 'L3'],
  right: ['R1', 'R2', 'R3'],
  edges: [
    { from: 'L1', to: 'R1' },
    { from: 'L1', to: 'R2' },
    { from: 'L2', to: 'R1' },
    { from: 'L2', to: 'R3' },
    { from: 'L3', to: 'R2' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贪心二分匹配', en: 'Greedy matching' }).commit();
  const sz = greedyMatching(input, {
    onMatch: (a, b) =>
      rec
        .begin({ zh: '匹配 ' + a + '-' + b, en: 'match ' + a + '-' + b })
        .setBars([{ value: 1, role: 'final' as BarRole, label: a + '-' + b }])
        .commit(),
  });
  rec
    .begin({ zh: '匹配数 = ' + sz, en: 'size = ' + sz })
    .setAux([{ label: 'size', value: String(sz), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
