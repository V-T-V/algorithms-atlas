// 3 的幂 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscPowerOf3 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=27', en: 'n=27' }).commit();
  const r = miscPowerOf3(27, {
    onDivide: (cur) => rec.begin({ zh: `→ ${cur}`, en: `→ ${cur}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
