// 三角形重心 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { centroid } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '给定三角形', en: 'given triangle' }).commit();
  rec
    .begin({ zh: '重心 = 三顶点平均', en: 'centroid = average of vertices' })
    .setAux([
      {
        label: 'G',
        value:
          '(' +
          centroid({ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 }).x.toFixed(2) +
          ',' +
          centroid({ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 3 }).y.toFixed(2) +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
