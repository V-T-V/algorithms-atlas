// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { majorityVote } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = majorityVote([
    [0, 1],
    [0, 1],
    [1, 1],
  ]).join(',');
  rec
    .begin({ zh: '投票完成', en: 'voted' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
