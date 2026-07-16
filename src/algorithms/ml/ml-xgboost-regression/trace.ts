// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xgboostRegression, predictXGB } from './impl.ts';
const X = [[1], [2], [3], [4]];
const y = [2, 4, 6, 8];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(predictXGB(xgboostRegression(X, y, 30), [2.5]) * 100) / 100;
  rec
    .begin({ zh: 'XGBoost 训练完成', en: 'XGBoost done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
