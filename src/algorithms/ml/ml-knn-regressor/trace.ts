// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knnRegressor } from './impl.ts';
const train = [
  { x: [0, 0], y: 0 },
  { x: [1, 0], y: 1 },
  { x: [0, 1], y: 1 },
  { x: [2, 2], y: 2 },
];
const q = [1, 1];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = knnRegressor(train, q, 3);
  rec
    .begin({ zh: '预测完成', en: 'prediction done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
