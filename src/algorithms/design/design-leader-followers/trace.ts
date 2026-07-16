import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LfPool } from './impl.ts';
export const DEFAULT_INPUT: any = { size: 3, events: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '领导者-追随者', en: 'Leader-Followers' }).commit();
  const p = new LfPool();
  p.setSize(input.size);
  for (let i = 0; i < input.events; i++) {
    const leader = p.currentLeader();
    rec
      .begin({ zh: '事件 ' + i + ' 由 ' + leader + ' 处理', en: 'event' })
      .setAux([{ label: 'leader', value: String(leader), role: 'compare' as BarRole }])
      .commit();
    p.promote();
  }
  rec
    .begin({ zh: '终态领导者 ' + p.currentLeader(), en: 'leader' })
    .setAux([{ label: 'leader', value: String(p.currentLeader()), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
