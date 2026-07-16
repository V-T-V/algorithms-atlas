// 多边形包围盒 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { polygonBounds } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入顶点', en: 'input vertices' }).commit();
  rec
    .begin({ zh: 'AABB 计算', en: 'AABB computed' })
    .setAux([
      {
        label: '宽×高',
        value:
          polygonBounds([
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 4, y: 3 },
            { x: 0, y: 3 },
          ])!.width +
          'x' +
          polygonBounds([
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 4, y: 3 },
            { x: 0, y: 3 },
          ])!.height,
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
