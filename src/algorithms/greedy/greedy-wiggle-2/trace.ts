// 摆动序列 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyWiggle2 } from './impl.ts';
const NUMS = [1, 7, 4, 9, 2, 5];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '摆动序列', en: 'Wiggle subsequence' }).commit();
  const r = greedyWiggle2(NUMS, {
    onTurn: (i, dir) =>
      rec
        .begin({
          zh: `拐点 i=${i} 方向 ${dir > 0 ? '↑' : '↓'}`,
          en: `Turn i=${i} dir ${dir > 0 ? 'up' : 'down'}`,
        })
        .setBars(
          NUMS.map((n, k) => ({ value: n, role: (k === i ? 'final' : 'default') as BarRole })),
        )
        .commit(),
  });
  rec
    .begin({ zh: `长度 ${r.length}`, en: `Length ${r.length}` })
    .setAux([{ label: '长度', value: String(r.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
