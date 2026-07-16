// 字符串相乘 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscMultiplyStr } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '"123"×"456"', en: '"123"×"456"' }).commit();
  const r = miscMultiplyStr('123', '456');
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
