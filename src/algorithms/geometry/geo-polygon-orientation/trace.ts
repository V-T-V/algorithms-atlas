// 多边形方向 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonOrientation } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '多边形输入', en: 'polygon input' }).commit();
  rec
    .begin({ zh: '方向判定', en: 'orientation decided' })
    .setAux([
      {
        label: '方向',
        value: polygonOrientation([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ]),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
