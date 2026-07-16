import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { balancedSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '平衡快速选择 k=5', en: 'balanced select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  balancedSelect(data, 5, 5, {
    onPartition: (l, r, p) =>
      rec
        .begin({ zh: `划分 [${l},${r}] @${p}`, en: `partition [${l},${r}] @${p}` })
        .setAux([{ label: 'p', value: String(p), role: 'compare' as BarRole }])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `第 5 小=${v}`, en: `5th=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
