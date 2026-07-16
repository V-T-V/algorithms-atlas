// 丑数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscUgly2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=6', en: 'n=6' }).commit();
  const r = miscUgly2(6, {
    onDivide: (f, cur) => rec.begin({ zh: `÷${f} → ${cur}`, en: `÷${f} → ${cur}` }).commit(),
  });
  rec
    .begin({ zh: `ugly=${r}`, en: `ugly=${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
