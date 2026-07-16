// Excel 列名 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscExcelColTitle2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=28', en: 'n=28' }).commit();
  const r = miscExcelColTitle2(28);
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
