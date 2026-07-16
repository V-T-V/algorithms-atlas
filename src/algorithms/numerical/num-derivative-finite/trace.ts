// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { derivative } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(derivative((x) => x * x, 3) * 1000) / 1000;
  rec
    .begin({ zh: '导数计算完成', en: 'derivative done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
