// 最后一个单词长度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscLengthLastWord2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="Hello World"', en: 's="Hello World"' }).commit();
  const r = miscLengthLastWord2('Hello World');
  rec
    .begin({ zh: `长度 ${r}`, en: `Length ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
