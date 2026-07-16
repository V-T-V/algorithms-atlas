// 多边形平移 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { translatePolygon } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入多边形与偏移', en: 'polygon and offset' }).commit();
  rec
    .begin({ zh: '平移完成', en: 'translated' })
    .setAux([
      {
        label: '首点',
        value:
          '(' +
          translatePolygon([{ x: 0, y: 0 }], 3, 4)[0]!.x +
          ',' +
          translatePolygon([{ x: 0, y: 0 }], 3, 4)[0]!.y +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
