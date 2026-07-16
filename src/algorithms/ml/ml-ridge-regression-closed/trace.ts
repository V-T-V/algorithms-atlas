// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ridgeRegression } from './impl.ts';
const X = [[1], [2], [3], [4]];
const y = [2, 4, 6, 8];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(ridgeRegression(X, y, 0.001).w[0]! * 100) / 100;
  rec
    .begin({ zh: '拟合完成', en: 'fit done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
