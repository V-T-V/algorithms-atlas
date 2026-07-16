// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { covarianceMatrix } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v =
    Math.round(
      covarianceMatrix([
        [1, 2],
        [3, 4],
        [5, 6],
      ])[0]![0]! * 100,
    ) / 100;
  rec
    .begin({ zh: '协方差', en: 'covariance' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
