import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { happensBefore } from './impl.ts';
export const DEFAULT_INPUT = {
  events: [1, 2, 3, 4],
  edges: [
    { a: 1, b: 2, kind: 'po' },
    { a: 2, b: 3, kind: 'lock' },
    { a: 3, b: 4, kind: 'po' },
  ],
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Happens-Before', en: 'Happens-Before' }).commit();
  const reach = happensBefore(input.events, input.edges, {
    onEdge: (a, b, k) =>
      rec
        .begin({ zh: a + ' ->' + k + '-> ' + b, en: 'edge' })
        .setAux([
          { label: 'edge', value: a + '-' + b, role: 'pivot' as BarRole },
          { label: 'kind', value: k, role: 'compare' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '传递闭包 ' + reach.flat().filter(Boolean).length + ' 条', en: 'closure' })
    .setAux([
      {
        label: 'reach',
        value: String(reach.flat().filter(Boolean).length),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
