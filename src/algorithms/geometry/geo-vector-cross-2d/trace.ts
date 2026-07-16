// 二维叉积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cross2D } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '向量 a 与 b', en: 'Vectors a and b' }).commit();
  rec
    .begin({ zh: '叉积完成', en: 'cross product done' })
    .setAux([
      {
        label: 'a×b',
        value: String(cross2D({ x: 3, y: 1 }, { x: 1, y: 2 })),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
