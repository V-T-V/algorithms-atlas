// 灯泡开关 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscBulb2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=9', en: 'n=9' }).commit();
  const r = miscBulb2(9);
  rec
    .begin({ zh: `${r} 个灯亮`, en: `${r} lit` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
