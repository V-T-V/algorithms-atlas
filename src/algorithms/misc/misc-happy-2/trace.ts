// 快乐数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscHappy2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=19', en: 'n=19' }).commit();
  const r = miscHappy2(19, {
    onStep: (n) => rec.begin({ zh: `→ ${n}`, en: `→ ${n}` }).commit(),
  });
  rec
    .begin({ zh: `happy=${r}`, en: `happy=${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
