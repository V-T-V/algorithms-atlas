// 跳跃游戏 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyJump3 } from './impl.ts';
const NUMS = [2, 3, 1, 1, 4];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '跳跃游戏 [2,3,1,1,4]', en: 'Jump game [2,3,1,1,4]' }).commit();
  const r = greedyJump3(NUMS, {
    onStep: (i, mr) =>
      rec
        .begin({ zh: `i=${i} maxReach=${mr}`, en: `i=${i} maxReach=${mr}` })
        .setBars(
          NUMS.map((n, k) => ({
            value: n,
            role: (k === i ? 'compare' : k <= mr ? 'final' : 'default') as BarRole,
          })),
        )
        .commit(),
  });
  rec
    .begin({ zh: `可达 ${r.reachable}`, en: `Reachable ${r.reachable}` })
    .setAux([{ label: '可达', value: String(r.reachable), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
