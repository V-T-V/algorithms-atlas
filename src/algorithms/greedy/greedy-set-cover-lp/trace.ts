import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { setCoverLpRounding } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const sets = [
    [0, 1, 2],
    [2, 3],
    [1, 3, 4],
    [0, 4],
  ];
  const w = [3, 2, 3, 2];
  rec.begin({ zh: '集合覆盖 LP 舍入', en: 'Set cover LP rounding' }).commit();
  const r = setCoverLpRounding(sets, w, 5, {
    onPick: (i, nw, ratio) =>
      rec
        .begin({
          zh: `选集${i} 新增${nw} 比值${ratio.toFixed(2)}`,
          en: `pick set${i} +${nw} ratio${ratio.toFixed(2)}`,
        })
        .setBars([{ value: ratio, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `总代价 ${r.cost}`, en: `total cost ${r.cost}` })
    .setAux([{ label: 'cost', value: String(r.cost), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
