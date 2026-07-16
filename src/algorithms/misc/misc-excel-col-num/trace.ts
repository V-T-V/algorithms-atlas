// Excel 列号 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscExcelColNum } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'title="AB"', en: 'title="AB"' }).commit();
  const r = miscExcelColNum('AB', {
    onChar: (ch, acc) => rec.begin({ zh: `${ch} → ${acc}`, en: `${ch} → ${acc}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
