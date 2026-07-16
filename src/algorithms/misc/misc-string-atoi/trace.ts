// atoi · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscStringAtoi } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="   -42"', en: 's="   -42"' }).commit();
  const r = miscStringAtoi('   -42', {
    onDigit: (i, d, acc) =>
      rec.begin({ zh: `i=${i} d=${d} acc=${acc}`, en: `i=${i} d=${d} acc=${acc}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
