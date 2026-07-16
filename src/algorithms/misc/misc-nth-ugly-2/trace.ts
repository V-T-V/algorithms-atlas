// 第 N 个丑数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscNthUgly2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=10', en: 'n=10' }).commit();
  const r = miscNthUgly2(10, {
    onStep: (i, v) => rec.begin({ zh: `${i}: ${v}`, en: `${i}: ${v}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
