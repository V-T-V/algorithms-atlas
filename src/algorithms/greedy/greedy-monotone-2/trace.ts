// 单调递增数字 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMonotone2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=332', en: 'n=332' }).commit();
  const r = greedyMonotone2(332, {
    onMark: (pos, m) =>
      rec
        .begin({ zh: `位置 ${pos} 标记 ${m}`, en: `pos ${pos} marker ${m}` })
        .setAux([{ label: '标记', value: String(m), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `结果 ${r.value}`, en: `Result ${r.value}` })
    .setAux([{ label: '答案', value: String(r.value), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
