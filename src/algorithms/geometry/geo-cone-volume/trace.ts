// 圆锥体积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coneVolume } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半径与高', en: 'radius and height' }).commit();
  rec
    .begin({ zh: '体积 = ⅓πr²h', en: 'volume = ⅓πr²h' })
    .setAux([{ label: '体积', value: coneVolume(2, 3).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
