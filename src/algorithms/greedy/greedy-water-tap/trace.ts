import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { waterFilling } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const caps = [2, 5, 3, 8];
  rec.begin({ zh: '注水 W=10', en: 'Water filling W=10' }).commit();
  const r = waterFilling(caps, 10, {
    onFill: (i, lv) =>
      rec
        .begin({ zh: `容器${i} 水位${lv.toFixed(2)}`, en: `container${i} level${lv.toFixed(2)}` })
        .setBars(r_levels(r).map((l) => ({ value: l, role: 'pivot' as BarRole })))
        .commit(),
  });
  rec
    .begin({ zh: `最小水位 ${r.minLevel.toFixed(2)}`, en: `min level ${r.minLevel.toFixed(2)}` })
    .setBars(r.levels.map((l) => ({ value: l, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
function r_levels(r: { levels: number[] }) {
  return r.levels;
}
