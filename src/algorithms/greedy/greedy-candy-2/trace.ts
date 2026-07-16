// 分发糖果 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyCandy2 } from './impl.ts';
const RATINGS = [1, 0, 2];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分发糖果：ratings=[1,0,2]', en: 'Candy: ratings=[1,0,2]' }).commit();
  const r = greedyCandy2(RATINGS, {
    onLeftSweep: (i, c) =>
      rec
        .begin({ zh: `左→右 i=${i}`, en: `L→R i=${i}` })
        .setBars(c.map((x) => ({ value: x, role: 'compare' as BarRole })))
        .commit(),
    onRightSweep: (i, c) =>
      rec
        .begin({ zh: `右→左 i=${i}`, en: `R→L i=${i}` })
        .setBars(c.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: `最少 ${r.total} 颗`, en: `Min ${r.total} candies` })
    .setBars(r.candies.map((x) => ({ value: x, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
