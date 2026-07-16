// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { markovChain } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = markovChain(
    [
      [0.5, 0.5],
      [0.5, 0.5],
    ],
    0,
    5,
    42,
  ).length;
  rec
    .begin({ zh: '模拟完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
