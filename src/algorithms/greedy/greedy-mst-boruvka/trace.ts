import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boruvkaMst, type Edge } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: Edge[] = [
    { u: 0, v: 1, w: 1 },
    { u: 1, v: 2, w: 2 },
    { u: 0, v: 2, w: 5 },
    { u: 2, v: 3, w: 3 },
  ];
  rec
    .begin({ zh: 'Borůvka MST', en: 'Boruvka MST' })
    .setGraph(
      [0, 1, 2, 3].map((i) => ({ id: String(i) })),
      E.map((e) => ({ from: String(e.u), to: String(e.v), weight: e.w })),
    )
    .commit();
  const r = boruvkaMst(4, E, {
    onRound: (rd, c, ad) =>
      rec
        .begin({ zh: `轮${rd} 剩${c}块 加${ad}边`, en: `round${rd} ${c}comps +${ad}edges` })
        .setBars([{ value: c, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `MST 权重 ${r.weight}`, en: `MST weight ${r.weight}` })
    .setAux([{ label: 'weight', value: String(r.weight), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
