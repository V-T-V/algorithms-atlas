import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { graphColoring } from './impl.ts';
export const DEFAULT_INPUT = {
  n: 4,
  edges: [
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
  ] as Array<[number, number]>,
  m: 3,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: input.m + ' 着色', en: input.m + '-coloring' }).commit();
  const ok = graphColoring(input.n, input.edges, input.m, {
    onColor: (v, c) =>
      rec
        .begin({ zh: v + ' 染色 ' + c, en: 'v' + v + ' color ' + c })
        .setAux([{ label: 'color', value: String(c), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '可着色？' + ok, en: 'ok? ' + ok })
    .setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
