// 戳印序列 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyStamping2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'stamp="abc" target="ababc"', en: 'stamp="abc" target="ababc"' }).commit();
  const r = greedyStamping2('abc', 'ababc', {
    onUnstamp: (i) => rec.begin({ zh: `在 ${i} 反向剥除`, en: `Unstamp at ${i}` }).commit(),
  });
  rec
    .begin({ zh: `顺序 ${r.order.join(',')}`, en: `Order ${r.order.join(',')}` })
    .setAux([{ label: '顺序', value: r.order.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
