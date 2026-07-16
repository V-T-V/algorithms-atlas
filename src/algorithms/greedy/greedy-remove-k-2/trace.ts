// 移掉 K 位数字 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyRemoveK2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'num="1432219" k=3', en: 'num="1432219" k=3' }).commit();
  const r = greedyRemoveK2('1432219', 3, {
    onPop: (p) => rec.begin({ zh: `弹出 ${p}`, en: `Pop ${p}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r.value}`, en: `Result ${r.value}` })
    .setAux([{ label: '答案', value: r.value, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
