// =============================================================================
// 两数相加（前置补零法）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, addTwo2, type AddTwo2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number[]; b: number[] } = { a: [2, 4, 3], b: [5, 6, 4] };

export function buildTrace(input: { a: number[]; b: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const acc: number[] = [];

  rec
    .begin({
      zh: `a=${a.join(' → ')}, b=${b.join(' → ')}`,
      en: `a=${a.join(' → ')}, b=${b.join(' → ')}`,
    })
    .setAux([
      { label: 'a', value: a.join(' → ') },
      { label: 'b', value: b.join(' → ') },
      { label: 'out', value: '-', role: 'frontier' },
    ])
    .commit();

  const hooks: AddTwo2Hooks = {
    onDigit: (da, db, digit, carry) => {
      acc.push(digit);
      rec
        .begin({
          zh: `${da} + ${db} = ${digit}（进位 ${carry}）`,
          en: `${da} + ${db} = ${digit} (carry ${carry})`,
        })
        .setAux([
          { label: 'a_digit', value: String(da), role: 'compare' },
          { label: 'b_digit', value: String(db), role: 'swap' },
          { label: 'out', value: acc.join(' → '), role: 'frontier' },
          { label: 'carry', value: String(carry), role: 'pivot' },
        ])
        .commit();
    },
  };

  const result = addTwo2(buildList(a), buildList(b), hooks);
  void result;

  rec
    .begin({ zh: `结果：${acc.join(' → ')}`, en: `Result: ${acc.join(' → ')}` })
    .setAux([{ label: 'result', value: acc.join(' → '), role: 'final' }])
    .commit();
  return rec.build();
}
