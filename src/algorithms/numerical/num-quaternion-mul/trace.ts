// 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { qMul } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const v = Math.round(qMul({ w: 1, x: 0, y: 0, z: 0 }, { w: 2, x: 0, y: 0, z: 0 }).w * 100) / 100;
  rec
    .begin({ zh: '四元数乘完成', en: 'done' })
    .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
