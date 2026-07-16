// 三点共线判定 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { areCollinear } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入三点', en: 'three points' }).commit();
  rec
    .begin({ zh: '共线判定', en: 'collinearity test' })
    .setAux([
      {
        label: '共线?',
        value: String(areCollinear({ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 })),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
