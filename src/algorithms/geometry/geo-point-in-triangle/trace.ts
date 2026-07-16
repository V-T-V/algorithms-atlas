// 点在三角形内 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pointInTriangle } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入点与三角形', en: 'point and triangle' }).commit();
  rec
    .begin({ zh: '判定完成', en: 'test done' })
    .setAux([
      {
        label: '在内?',
        value: String(
          pointInTriangle({ x: 0.2, y: 0.2 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }),
        ),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
