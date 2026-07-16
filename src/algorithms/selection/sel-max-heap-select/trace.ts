import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxHeapSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8, 5, 2, 6, 4, 0];
  rec
    .begin({ zh: '最大堆选择 k=5', en: 'max-heap select k=5' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  maxHeapSelect(data, 5, {
    onPop: (v, rem) =>
      rec
        .begin({ zh: `弹出 ${v}（剩${rem}）`, en: `pop ${v} (${rem} left)` })
        .setAux([{ label: 'pop', value: String(v), role: 'swap' as BarRole }])
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `第 5 小=${v}`, en: `5th=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
