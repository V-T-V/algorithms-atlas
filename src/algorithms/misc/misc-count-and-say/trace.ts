// 外观数列 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscCountAndSay } from './impl.ts';
export const DEFAULT_INPUT = 5;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: `外观数列 n=${n}`, en: `Count and Say n=${n}` }).commit();
  const r = miscCountAndSay(n, {
    onIter: (i, term) =>
      rec
        .begin({ zh: `第 ${i} 项: ${term}`, en: `Term ${i}: ${term}` })
        .setAux([{ label: '项', value: term, role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
