import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxCut } from './impl.ts';
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
    .begin({ zh: '贪心最大割', en: 'Greedy max cut' })
    .setGraph(
      [0, 1, 2, 3].map((i) => ({ id: String(i) })),
      E.map((e) => ({ from: String(e[0]), to: String(e[1]) })),
    )
    .commit();
  const r = greedyMaxCut(4, E, {
    onPlace: (v, s, g) =>
      rec
        .begin({ zh: `${v} -> 侧${s} (+${g})`, en: `${v} -> side${s} (+${g})` })
        .setBars([{ value: g, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `割大小 ${r.cutSize}`, en: `cut size ${r.cutSize}` })
    .setAux([{ label: 'cut', value: String(r.cutSize), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
