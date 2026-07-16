// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { informationGain } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v =
    Math.round(
      informationGain(
        [0, 0, 1, 1],
        [
          [0, 0],
          [1, 1],
        ],
      ) * 100,
    ) / 100;
  rec
    .begin({ zh: '增益', en: 'gain' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
