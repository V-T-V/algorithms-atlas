// 闵可夫斯基和 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minkowskiSum } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '两个凸多边形', en: 'two convex polygons' }).commit();
  rec
    .begin({ zh: '和的凸多边形', en: 'sum polygon' })
    .setAux([
      {
        label: '顶点数',
        value: String(
          minkowskiSum(
            [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 1, y: 1 },
              { x: 0, y: 1 },
            ],
            [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 1, y: 1 },
              { x: 0, y: 1 },
            ],
          ).length,
        ),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
