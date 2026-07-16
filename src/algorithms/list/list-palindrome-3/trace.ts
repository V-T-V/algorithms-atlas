import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, isPalindrome } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 2, 1];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '回文判断', en: 'Palindrome check' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const r = isPalindrome(head, {
    onCompare: (a, b) =>
      rec
        .begin({ zh: '比较 ' + a + ' 与 ' + b, en: 'compare ' + a + ' vs ' + b })
        .setAux([
          { label: 'a', value: String(a), role: 'pivot' as BarRole },
          { label: 'b', value: String(b), role: 'frontier' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '回文？' + r, en: 'palindrome? ' + r })
    .setAux([{ label: 'result', value: String(r), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
