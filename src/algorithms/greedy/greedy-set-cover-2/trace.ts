// 集合覆盖 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedySetCover2 } from './impl.ts';
const UNI = [0, 1, 2, 3, 4, 5, 6, 7];
const SETS = [
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 6],
  [6, 7, 0],
  [1, 3, 5, 7],
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '集合覆盖贪心', en: 'Greedy set cover' }).commit();
  const r = greedySetCover2(UNI, SETS, {
    onPick: (i, g) =>
      rec
        .begin({ zh: `选集合 ${i}（新增 ${g} 个）`, en: `Pick set ${i} (gain ${g})` })
        .setAux([{ label: '集合', value: String(i), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: `共 ${r.picked.length} 个集合覆盖 ${r.totalCovered}`,
      en: `${r.picked.length} sets cover ${r.totalCovered}`,
    })
    .setAux([{ label: '集合数', value: String(r.picked.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
