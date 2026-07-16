// 加一 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscPlusOne2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '[9,9,9]+1', en: '[9,9,9]+1' }).commit();
  const r = miscPlusOne2([9, 9, 9], {
    onCarry: (i) => rec.begin({ zh: `进位 @${i}`, en: `Carry @${i}` }).commit(),
  });
  rec
    .begin({ zh: `结果 [${r.join(',')}]`, en: `Result [${r.join(',')}]` })
    .setBars(r.map((x) => ({ value: x, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
