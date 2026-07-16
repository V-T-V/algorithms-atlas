import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyVertexCover } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ];
  rec
    .begin({ zh: '贪心点覆盖', en: 'Greedy vertex cover' })
    .setGraph(
      [0, 1, 2, 3, 4].map((i) => ({ id: String(i) })),
      E.map((e) => ({ from: String(e[0]), to: String(e[1]) })),
    )
    .commit();
  const cov = greedyVertexCover(5, E, {
    onPick: (v, d) =>
      rec
        .begin({ zh: `选 ${v} (度${d})`, en: `pick ${v} (deg${d})` })
        .setBars([{ value: d, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `覆盖 {${cov.join(',')}}`, en: `cover {${cov.join(',')}}` })
    .setBars([{ value: cov.length, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
