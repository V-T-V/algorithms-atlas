// 拼接最大数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxNum2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '[10,2]', en: '[10,2]' }).commit();
  const r = greedyMaxNum2([10, 2], {
    onCompare: (a, b) => rec.begin({ zh: `比较 ${a} 和 ${b}`, en: `Compare ${a} ${b}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r.value}`, en: `Result ${r.value}` })
    .setAux([{ label: '答案', value: r.value, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
