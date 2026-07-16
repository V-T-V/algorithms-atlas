// 圆面积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circleArea } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半径', en: 'radius in' }).commit();
  rec
    .begin({ zh: '面积 = πr²', en: 'area = πr²' })
    .setAux([{ label: '面积', value: circleArea(2).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
