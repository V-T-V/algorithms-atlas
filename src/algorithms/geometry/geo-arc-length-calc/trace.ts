// 圆弧弧长 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { arcLength } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半径与角度', en: 'radius and angle' }).commit();
  rec
    .begin({ zh: '弧长 = rθ', en: 'arc = rθ' })
    .setAux([{ label: '弧长', value: arcLength(2, Math.PI).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
