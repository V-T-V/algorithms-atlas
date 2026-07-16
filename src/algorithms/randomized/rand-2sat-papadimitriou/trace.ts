// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoSat } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v =
    twoSat(
      [
        [1, 2],
        [-1, -2],
      ],
      2,
      42,
    ) === null
      ? 0
      : 1;
  rec
    .begin({ zh: '求解完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
