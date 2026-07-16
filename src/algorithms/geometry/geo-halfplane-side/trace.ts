// 点在半平面侧 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { halfPlaneSide } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入有向直线与点', en: 'directed line and point' }).commit();
  rec
    .begin({ zh: '侧判定', en: 'side decided' })
    .setAux([
      {
        label: '侧',
        value: halfPlaneSide({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
