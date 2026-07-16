// 线段中点 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { midpoint } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入线段', en: 'input segment' }).commit();
  rec
    .begin({ zh: '中点', en: 'midpoint' })
    .setAux([
      {
        label: '中点',
        value:
          '(' +
          midpoint({ x: 0, y: 0 }, { x: 4, y: 2 }).x +
          ',' +
          midpoint({ x: 0, y: 0 }, { x: 4, y: 2 }).y +
          ')',
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
