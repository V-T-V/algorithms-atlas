// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { weightedAverageEnsemble } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = weightedAverageEnsemble(
    [
      [1, 2],
      [3, 4],
    ],
    [1, 1],
  ).join(',');
  rec
    .begin({ zh: '集成完成', en: 'ensembled' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
