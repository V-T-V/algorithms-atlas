import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedySteinerTree } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [
    [0, 1, 2, 5],
    [1, 0, 3, 4],
    [2, 3, 0, 6],
    [5, 4, 6, 0],
  ];
  const T = [0, 1, 2, 3];
  rec.begin({ zh: '贪心 Steiner 树', en: 'Greedy Steiner tree' }).commit();
  const w = greedySteinerTree(D, T, {
    onAttach: (t, via, d) =>
      rec
        .begin({ zh: `${t} 经 ${via} 加入 (d=${d})`, en: `${t} via ${via} (d=${d})` })
        .setBars([{ value: d, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `总权重 ${w}`, en: `total weight ${w}` })
    .setAux([{ label: 'weight', value: String(w), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
