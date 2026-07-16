// Kruskal MST · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyKruskal3, type Edge } from './impl.ts';
const N = 4;
const EDGES: Edge[] = [
  { u: 0, v: 1, w: 1 },
  { u: 1, v: 2, w: 2 },
  { u: 2, v: 3, w: 3 },
  { u: 0, v: 3, w: 4 },
  { u: 0, v: 2, w: 5 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 'Kruskal：按权升序加边', en: 'Kruskal: edges by ascending weight' })
    .setBars(EDGES.map((e) => ({ value: e.w, role: 'default' as BarRole, label: `${e.u}-${e.v}` })))
    .commit();
  const r = greedyKruskal3(N, EDGES, {
    onConsider: (e, accept) => {
      rec
        .begin({
          zh: `考虑 ${e.u}-${e.v} (w=${e.w})：${accept ? '加入' : '拒绝'}`,
          en: `Consider ${e.u}-${e.v} (w=${e.w}): ${accept ? 'accept' : 'reject'}`,
        })
        .setBars(
          EDGES.map((e2) => ({
            value: e2.w,
            role: (e2 === e ? (accept ? 'final' : 'warn') : 'default') as BarRole,
            label: `${e2.u}-${e2.v}`,
          })),
        )
        .commit();
    },
  });
  rec
    .begin({ zh: `MST 权重 ${r.totalWeight}`, en: `MST weight ${r.totalWeight}` })
    .setAux([{ label: '总权重', value: String(r.totalWeight), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
