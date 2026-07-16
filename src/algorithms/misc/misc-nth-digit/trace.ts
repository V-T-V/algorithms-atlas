// =============================================================================
// 第 N 位数字 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findNthDigit, type NthDigitHooks } from './impl.ts';

export const DEFAULT_INPUT = 11;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const groups: Array<{ len: number; count: number; start: number }> = [];
  const located: { number: number; digitIndex: number; digit: number } = {
    number: 0,
    digitIndex: 0,
    digit: 0,
  };
  let hasLocated = false;

  rec
    .begin({ zh: `求序列第 ${input} 位`, en: `Find digit #${input}` })
    .setAux([{ label: 'n', value: String(input), role: 'pivot' as BarRole }])
    .commit();

  const hooks: NthDigitHooks = {
    onGroup: (len, count, start) => groups.push({ len, count, start }),
    onLocate: (number, digitIndex, digit) => {
      located.number = number;
      located.digitIndex = digitIndex;
      located.digit = digit;
      hasLocated = true;
    },
  };

  const result = findNthDigit(input, hooks);

  for (const g of groups) {
    rec
      .begin({
        zh: `跳过 ${g.count} 个 ${g.len} 位数（${g.start}..${g.start + g.count - 1}）`,
        en: `Skip ${g.count} ${g.len}-digit numbers (${g.start}..${g.start + g.count - 1})`,
      })
      .setAux([
        { label: '位数', value: String(g.len), role: 'compare' as BarRole },
        { label: '个数', value: String(g.count), role: 'pivot' as BarRole },
      ])
      .commit();
  }

  if (hasLocated) {
    rec
      .begin({
        zh: `定位到数 ${located.number} 的第 ${located.digitIndex} 位 = ${located.digit}`,
        en: `Located number ${located.number}, digit ${located.digitIndex} = ${located.digit}`,
      })
      .setAux([
        { label: '数字所在数', value: String(located.number), role: 'compare' as BarRole },
        { label: '该数第几位', value: String(located.digitIndex), role: 'pivot' as BarRole },
        { label: '答案', value: String(located.digit), role: 'final' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({ zh: `第 ${input} 位 = ${result}`, en: `Digit #${input} = ${result}` })
    .setAux([{ label: '答案', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
