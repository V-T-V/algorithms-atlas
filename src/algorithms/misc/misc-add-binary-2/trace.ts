// 二进制求和 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscAddBinary2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'a="11" b="1"', en: 'a="11" b="1"' }).commit();
  const r = miscAddBinary2('11', '1', {
    onDigit: (c, s) =>
      rec.begin({ zh: `进位 ${c} 本位和 ${s}`, en: `carry ${c} sum ${s}` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
