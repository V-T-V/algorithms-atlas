// 完全平方数判定 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscIsPerfectSquare } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'num=16', en: 'num=16' }).commit();
  const r = miscIsPerfectSquare(16, {
    onProbe: (m, sq) => rec.begin({ zh: `mid=${m} sq=${sq}`, en: `mid=${m} sq=${sq}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
