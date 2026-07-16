import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyEdgeColoring } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 2],
  ];
  rec
    .begin({ zh: '贪心边着色', en: 'Greedy edge coloring' })
    .setGraph(
      [0, 1, 2, 3].map((i) => ({ id: String(i) })),
      E.map((e) => ({ from: String(e[0]), to: String(e[1]) })),
    )
    .commit();
  const c = greedyEdgeColoring(E, {
    onColor: (u, v, col) =>
      rec
        .begin({ zh: `(${u},${v}) 色${col}`, en: `(${u},${v}) color${col}` })
        .setBars([{ value: col, role: 'final' as BarRole }])
        .commit(),
  });
  rec.begin({ zh: `${c} 色`, en: `${c} colors` }).commit();
  return rec.build();
}
