// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxCutLocal } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = maxCutLocal(
    [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
    3,
    42,
  ).cut;
  rec
    .begin({ zh: '分割完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
