// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heInit } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = heInit(10, 5, 1).length;
  rec
    .begin({ zh: '初始化完成', en: 'initialized' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
