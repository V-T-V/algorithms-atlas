// 重心坐标 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { barycentric } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入点与三角形', en: 'point and triangle' }).commit();
  rec
    .begin({ zh: '重心坐标', en: 'barycentric coords' })
    .setAux([
      {
        label: 'uvw',
        value: JSON.stringify(
          barycentric({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }),
        ),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
