// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { conv1d, maxPool1d } from './impl.ts';
const x = [1, 2, 3, 4, 5, 6];
const k = [1, 0, -1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = maxPool1d(conv1d(x, k)).length;
  rec
    .begin({ zh: 'CNN 前向完成', en: 'CNN forward done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
