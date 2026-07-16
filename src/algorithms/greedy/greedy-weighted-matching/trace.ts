import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyWeightedMatching, type WEdge } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: WEdge[] = [
    { u: 0, v: 1, w: 5 },
    { u: 1, v: 2, w: 3 },
    { u: 2, v: 3, w: 4 },
    { u: 0, v: 3, w: 2 },
  ];
  rec
    .begin({ zh: '贪心最大权匹配', en: 'Greedy max weight matching' })
    .setGraph(
      [0, 1, 2, 3].map((i) => ({ id: String(i) })),
      E.map((e) => ({ from: String(e.u), to: String(e.v), weight: e.w })),
    )
    .commit();
  const r = greedyWeightedMatching(E, {
    onPick: (u, v, w) =>
      rec
        .begin({ zh: `选 (${u},${v}) w=${w}`, en: `pick (${u},${v}) w=${w}` })
        .setBars([{ value: w, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `总权 ${r.total} ${r.count}条`, en: `total ${r.total} ${r.count}edges` })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
