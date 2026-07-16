// 两数相加（链表） · 录制帧序列
// 用 setArray 展示两条输入链表 + 结果链表 + 进位。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  addTwoNumbers,
  fromArray,
  toArray,
  type AddTwoNumbersHooks,
  type ListNode,
} from './impl.ts';

export const DEFAULT_INPUT = {
  l1: [2, 4, 3], // 342
  l2: [5, 6, 4], // 465 → 和 807 → [7,0,8]
};

export function buildTrace(input: { l1: number[]; l2: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const resultDigits: number[] = [];
  let carry = 0;

  const snapshot = (note: { zh: string; en: string }) => {
    const maxLen = Math.max(input.l1.length, input.l2.length, resultDigits.length, 1);
    const padded1 = [...input.l1, ...new Array(Math.max(0, maxLen - input.l1.length)).fill(NaN)];
    const padded2 = [...input.l2, ...new Array(Math.max(0, maxLen - input.l2.length)).fill(NaN)];
    rec
      .begin(note)
      .setAux([
        { label: '加数 L1', value: input.l1.join(' → '), role: 'compare' as BarRole },
        { label: '加数 L2', value: input.l2.join(' → '), role: 'compare' as BarRole },
        { label: '进位 carry', value: String(carry), role: 'pivot' as BarRole },
        { label: '结果', value: resultDigits.join(' → ') || '∅', role: 'final' as BarRole },
      ])
      .commit();
    void padded1;
    void padded2;
  };

  snapshot({ zh: 'L1=342, L2=465，逐位相加', en: 'L1=342, L2=465, digit by digit' });

  const hooks: AddTwoNumbersHooks = {
    onAddDigit: (v1, v2, c, digit) => {
      carry = c;
      resultDigits.push(digit);
      snapshot({
        zh: `${v1 ?? 0} + ${v2 ?? 0} + 进位 → ${digit}（进位 ${carry}）`,
        en: `${v1 ?? 0} + ${v2 ?? 0} + carry → ${digit} (carry ${carry})`,
      });
    },
  };

  void addTwoNumbers(fromArray(input.l1), fromArray(input.l2), hooks);

  rec
    .begin({ zh: `结果：${resultDigits.join(' → ')}`, en: `Result: ${resultDigits.join(' → ')}` })
    .setAux([{ label: '结果', value: resultDigits.join(' → '), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}

/** 链表转数组（重导出，供外部使用）。 */
export { toArray, type ListNode };
