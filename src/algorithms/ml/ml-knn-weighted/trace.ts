// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedKnn, type Sample } from './impl.ts';
const train: Sample[] = [
  { x: [0, 0], y: 0 },
  { x: [0.1, 0.1], y: 0 },
  { x: [5, 5], y: 1 },
  { x: [5.1, 5.1], y: 1 },
];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = weightedKnn(train, [0.2, 0.2]);
  rec
    .begin({ zh: '加权KNN 预测完成', en: 'weighted kNN done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
