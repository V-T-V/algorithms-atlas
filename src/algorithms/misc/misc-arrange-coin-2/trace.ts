// 排列硬币 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscArrangeCoin2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=5', en: 'n=5' }).commit();
  const r = miscArrangeCoin2(5, {
    onProbe: (m, u) => rec.begin({ zh: `mid=${m} 用 ${u}`, en: `mid=${m} used ${u}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
