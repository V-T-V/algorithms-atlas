// =============================================================================
// 两数相加 II · 录制帧序列
// 用 setArray 展示结果链表值序列（逐位头插），setAux 展示进位与栈。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { addTwoNumbers2, fromArray, toArray, type AddTwoNumbers2Hooks } from './impl.ts';

export const DEFAULT_INPUT = {
  l1: [7, 2, 4, 3],
  l2: [5, 6, 4],
};

export function buildTrace(input: { l1: number[]; l2: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = fromArray(input.l1);
  const b = fromArray(input.l2);

  // 当前结果链表的值序列（头插，从空逐步增长）
  let resultValues: number[] = [];
  let curCarry = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setArray(
        resultValues,
        resultValues.map(() => 'final' as BarRole),
        [],
      )
      .setAux([
        { label: '进位', value: String(curCarry), role: 'warn' as BarRole },
        { label: 'l1', value: `[${input.l1.join(', ')}]`, role: 'compare' as BarRole },
        { label: 'l2', value: `[${input.l2.join(', ')}]`, role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({
    zh: `l1 = [${input.l1.join(', ')}]（=${input.l1.join('')}），l2 = [${input.l2.join(', ')}]`,
    en: `l1 = [${input.l1.join(', ')}] (=${input.l1.join('')}), l2 = [${input.l2.join(', ')}]`,
  });

  const hooks: AddTwoNumbers2Hooks = {
    onPush: () => {
      /* 压栈不单独成帧 */
    },
    onAddDigit: (v1, v2, carry, digit) => {
      curCarry = carry;
      void v1;
      void v2;
      void digit;
    },
    onPrepend: (digit) => {
      resultValues = [digit, ...resultValues];
      snap({
        zh: `本位 ${digit} 头插 → [${resultValues.join(', ')}]`,
        en: `Prepend digit ${digit} → [${resultValues.join(', ')}]`,
      });
    },
  };

  const result = addTwoNumbers2(a, b, hooks);
  const final = toArray(result);

  rec
    .begin({
      zh: `完成：[${final.join(', ')}]（=${final.join('')}）`,
      en: `Done: [${final.join(', ')}] (=${final.join('')})`,
    })
    .setArray(
      final,
      final.map(() => 'final' as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
