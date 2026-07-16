// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { median } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = median([1, 2, 3, 4, 5]);
  rec
    .begin({ zh: '中位数完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
