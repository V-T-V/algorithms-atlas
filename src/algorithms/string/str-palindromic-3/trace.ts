// =============================================================================
// 回文子串计数 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countPalindromes } from './impl.ts';

export const DEFAULT_INPUT = 'aaa';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { total } = countPalindromes(input, {
    onFound: (l, r) => {
      rec
        .begin({
          zh: `发现回文 '${input.slice(l, r + 1)}' [${l},${r}]`,
          en: `Found palindrome '${input.slice(l, r + 1)}' [${l},${r}]`,
        })
        .setBars(
          input.split('').map((ch, i) => ({
            value: ch.charCodeAt(0),
            role: i >= l && i <= r ? 'final' : 'default',
          })),
        )
        .commit();
    },
  });

  rec
    .begin({ zh: `共 ${total} 个回文子串`, en: `${total} palindromic substrings` })
    .setBars(input.split('').map((ch) => ({ value: ch.charCodeAt(0), role: 'final' })))
    .setAux([{ label: 'total', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
