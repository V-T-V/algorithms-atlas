// 分发饼干 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyAssign2 } from './impl.ts';
const G = [1, 2, 3];
const S = [1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '分发饼干', en: 'Assign cookies' }).commit();
  const r = greedyAssign2(G, S, {
    onMatch: (i, j) =>
      rec.begin({ zh: `孩子 ${i} ← 饼干 ${j}`, en: `Child ${i} ← cookie ${j}` }).commit(),
  });
  rec
    .begin({ zh: `满足 ${r.count} 个`, en: `${r.count} satisfied` })
    .setAux([{ label: '数量', value: String(r.count), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
