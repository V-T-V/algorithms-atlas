// 重构字符串 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyReorganize2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="aab"', en: 's="aab"' }).commit();
  const r = greedyReorganize2('aab', {
    onPlace: (i, ch) => rec.begin({ zh: `放 ${ch} 到 ${i}`, en: `Place ${ch} at ${i}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r.value}`, en: `Result ${r.value}` })
    .setAux([{ label: '答案', value: r.value, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
