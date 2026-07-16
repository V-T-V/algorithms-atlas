// 长方体体积 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boxVolume } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入三边长', en: 'three sides' }).commit();
  rec
    .begin({ zh: '体积', en: 'volume' })
    .setAux([{ label: '体积', value: boxVolume(2, 3, 4).toString(), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
