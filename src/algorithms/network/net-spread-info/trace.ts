import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { spreadInfo, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D', 'E'],
  sources: ['A', 'C'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '信息传播', en: 'Info spread' }).commit();
  const dist = spreadInfo(input, {
    onReach: (v, d) =>
      rec
        .begin({ zh: v + ' 距离 ' + d, en: v + ' d=' + d })
        .setAux([{ label: 'dist', value: String(d), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(
      [...dist.entries()].map(([k, v]) => ({ value: v, role: 'final' as BarRole, label: k })),
    )
    .commit();
  return rec.build();
}
