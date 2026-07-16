import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyColor, type GraphInput } from './impl.ts';
export const DEFAULT_INPUT: GraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
  ],
};
export function buildTrace(input: GraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '图贪心染色', en: 'Greedy coloring' }).commit();
  const color = greedyColor(input, {
    onColor: (v, c) =>
      rec
        .begin({ zh: v + ' 染色 ' + c, en: v + ' color ' + c })
        .setAux([{ label: 'color', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: '用色数 = ' + Math.max(...color.values()),
      en: 'colors = ' + Math.max(...color.values()),
    })
    .setAux([
      { label: 'colors', value: String(Math.max(...color.values())), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
