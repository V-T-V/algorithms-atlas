// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crossEntropy } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(crossEntropy([1, 0], [0.9, 0.1]) * 1000) / 1000;
  rec
    .begin({ zh: '损失', en: 'loss' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
