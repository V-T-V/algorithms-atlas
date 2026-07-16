// Prim MST · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyPrim3 } from './impl.ts';
const G: ReadonlyArray<readonly number[]> = [
  [0, 1, 5, 4],
  [1, 0, 2, 0],
  [5, 2, 0, 3],
  [4, 0, 3, 0],
].map((r) => r.map((x) => (x === 0 ? Infinity : x)));
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Prim：从顶点 0 开始扩展', en: 'Prim: grow from vertex 0' }).commit();
  const r = greedyPrim3(G, 0, {
    onPick: (u, v, w) => {
      rec
        .begin({ zh: `加入边 ${u}-${v} (w=${w})`, en: `Add edge ${u}-${v} (w=${w})` })
        .setAux([
          { label: '边', value: `${u}-${v}`, role: 'final' as BarRole },
          { label: '权', value: String(w), role: 'compare' as BarRole },
        ])
        .commit();
    },
  });
  rec
    .begin({ zh: `MST 权重 ${r.totalWeight}`, en: `MST weight ${r.totalWeight}` })
    .setAux([{ label: '总权重', value: String(r.totalWeight), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
