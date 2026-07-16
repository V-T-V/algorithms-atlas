// 线段长度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segmentLength } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入线段', en: 'input segment' }).commit();
  rec
    .begin({ zh: '欧氏长度', en: 'euclidean length' })
    .setAux([
      {
        label: '长度',
        value: segmentLength({ x: 0, y: 0 }, { x: 3, y: 4 }).toFixed(3),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
