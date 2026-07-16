// 扇形面积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sectorArea } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半径与角度', en: 'radius and angle' }).commit();
  rec
    .begin({ zh: '面积 = ½r²θ', en: 'area = ½r²θ' })
    .setAux([{ label: '面积', value: sectorArea(2, Math.PI).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
