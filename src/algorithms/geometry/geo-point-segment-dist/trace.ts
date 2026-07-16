// 点到线段距离 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pointSegmentDistance } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入点与线段', en: 'point and segment' }).commit();
  rec
    .begin({ zh: '最短距离', en: 'shortest distance' })
    .setAux([
      {
        label: '距离',
        value: pointSegmentDistance({ x: 1, y: 2 }, { x: 0, y: 0 }, { x: 4, y: 0 }).toFixed(3),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
