// =============================================================================
// 回文链表（快慢+反转后半）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, isPalindrome2, type IsPalindrome2Hooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2, 1];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始链表：${input.join(' → ')}`, en: `Initial list: ${input.join(' → ')}` })
    .setAux([{ label: 'list', value: input.join(' → '), role: 'frontier' }])
    .commit();

  const hooks: IsPalindrome2Hooks = {
    onMid: (v) => {
      rec
        .begin({ zh: `中点：${v}`, en: `Midpoint: ${v}` })
        .setAux([{ label: 'mid', value: String(v), role: 'pivot' }])
        .commit();
    },
    onReverse: (v) => {
      rec
        .begin({ zh: `反转后半段，新头：${v}`, en: `Reversed second half, head: ${v}` })
        .setAux([{ label: 'secondHead', value: String(v), role: 'swap' }])
        .commit();
    },
    onCompare: (a, b, ok) => {
      rec
        .begin({
          zh: `比较 ${a} vs ${b}：${ok ? '相等' : '不等'}`,
          en: `Compare ${a} vs ${b}: ${ok ? 'equal' : 'diff'}`,
        })
        .setAux([
          { label: 'a', value: String(a), role: 'compare' },
          { label: 'b', value: String(b), role: 'swap' },
        ])
        .commit();
    },
  };

  const result = isPalindrome2(buildList(input), hooks);

  rec
    .begin({
      zh: `结果：${result ? '是回文' : '非回文'}`,
      en: `Result: ${result ? 'palindrome' : 'not palindrome'}`,
    })
    .setAux([{ label: 'palindrome', value: String(result), role: 'final' }])
    .commit();
  return rec.build();
}
