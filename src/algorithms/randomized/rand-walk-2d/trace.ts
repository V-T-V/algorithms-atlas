// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomWalk2D } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = randomWalk2D(10, 42).length;
  rec
    .begin({ zh: '游走完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
