// 阶乘末尾零（数学）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscTrailingZero } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=25', en: 'n=25' }).commit();
  const r = miscTrailingZero(25, {
    onStep: (d, c) => rec.begin({ zh: `⌊25/${d}⌋=${c}`, en: `⌊25/${d}⌋=${c}` }).commit(),
  });
  rec
    .begin({ zh: `${r} 个 0`, en: `${r} zeros` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
