// 阶乘末尾零 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscFactorialTrail2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=10', en: 'n=10' }).commit();
  const r = miscFactorialTrail2(10, {
    onIter: (i) => rec.begin({ zh: `${i}!`, en: `${i}!` }).commit(),
  });
  rec
    .begin({ zh: `${r} 个 0`, en: `${r} zeros` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
