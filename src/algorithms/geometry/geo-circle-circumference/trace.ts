// 圆周长 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circleCircumference } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半径', en: 'radius in' }).commit();
  rec
    .begin({ zh: '周长 = 2πr', en: 'circumference = 2πr' })
    .setAux([{ label: '周长', value: circleCircumference(1).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
