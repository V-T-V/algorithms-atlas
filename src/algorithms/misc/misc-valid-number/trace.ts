// 有效数字 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscValidNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's=" -1.23e+4 "', en: 's=" -1.23e+4 "' }).commit();
  const r = miscValidNumber(' -1.23e+4 ', {
    onState: (i, st) => rec.begin({ zh: `i=${i} state=${st}`, en: `i=${i} state=${st}` }).commit(),
  });
  rec
    .begin({ zh: `有效 ${r}`, en: `Valid ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
