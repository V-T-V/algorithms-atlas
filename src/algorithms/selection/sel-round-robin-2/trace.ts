import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { roundRobinSelect } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const data = [9, 3, 7, 1, 8];
  rec
    .begin({ zh: '循环赛选择 k=2', en: 'round-robin select k=2' })
    .setBars(data.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();
  roundRobinSelect(data, 2, {
    onCompare: (i, j) =>
      rec
        .begin({ zh: `比较 ${data[i]} vs ${data[j]}`, en: `compare ${data[i]} vs ${data[j]}` })
        .setBars(
          data.map((v, idx) => ({
            value: v,
            role: (idx === i || idx === j ? 'compare' : 'default') as BarRole,
          })),
        )
        .commit(),
    onResult: (v) =>
      rec
        .begin({ zh: `第 2 小=${v}`, en: `2nd=${v}` })
        .setBars(data.map((x) => ({ value: x, role: (x === v ? 'final' : 'default') as BarRole })))
        .commit(),
  });
  return rec.build();
}
