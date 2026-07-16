// 简化路径 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscSimplifyPath } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'path="/home//foo/"', en: 'path="/home//foo/"' }).commit();
  const r = miscSimplifyPath('/home//foo/', {
    onToken: (t) => rec.begin({ zh: `token '${t}'`, en: `token '${t}'` }).commit(),
  });
  rec
    .begin({ zh: `结果 ${r}`, en: `Result ${r}` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
