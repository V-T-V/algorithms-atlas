// 多边形旋转 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotatePolygon } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入多边形与角度', en: 'polygon and angle' }).commit();
  rec
    .begin({ zh: '旋转完成', en: 'rotated' })
    .setAux([
      {
        label: '首点x',
        value: rotatePolygon([{ x: 1, y: 0 }], { x: 0, y: 0 }, Math.PI / 2)[0]!.x.toFixed(3),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
