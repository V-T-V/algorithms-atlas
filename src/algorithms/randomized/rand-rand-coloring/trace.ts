// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { randomColoring } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = randomColoring(
    [
      [1, 2],
      [0, 2],
      [0, 1],
    ],
    42,
  ).join(',');
  rec
    .begin({ zh: '着色完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
