// 验证回文短语 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscValidPalindromePhr } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: 's="A man, a plan, a canal: Panama"', en: 's="A man, a plan, a canal: Panama"' })
    .commit();
  const r = miscValidPalindromePhr('A man, a plan, a canal: Panama');
  rec
    .begin({ zh: `回文 ${r}`, en: `Palindrome ${r}` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
