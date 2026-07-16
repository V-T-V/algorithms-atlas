// 三点定圆 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circleThrough3 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '三点输入', en: 'three points in' }).commit();
  rec
    .begin({ zh: '外接圆确定', en: 'circumcircle found' })
    .setAux([
      {
        label: '半径',
        value: circleThrough3({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }).radius.toFixed(3),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
