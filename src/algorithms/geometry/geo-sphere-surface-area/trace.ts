// 球表面积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sphereSurfaceArea } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半径', en: 'radius' }).commit();
  rec
    .begin({ zh: '表面积 = 4πr²', en: 'area = 4πr²' })
    .setAux([{ label: '面积', value: sphereSurfaceArea(1).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
