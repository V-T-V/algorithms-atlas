// =============================================================================
// 位运算加法 · 录制帧序列
// 演示一对固定操作数的逐轮进位传播；setAux 展示无进位和 sum 与进位 carry 的二进制。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { add, type AddHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 13, b: 29 };

const bin32 = (n: number): string => (n >>> 0).toString(2).padStart(8, '0').slice(-8);

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  rec
    .begin({
      zh: `计算 ${a} + ${b}（不使用 + 运算符）`,
      en: `Compute ${a} + ${b} without the + operator`,
    })
    .setAux([
      { label: 'a (二进制)', value: bin32(a), role: 'pivot' },
      { label: 'b (二进制)', value: bin32(b), role: 'pivot' },
    ])
    .commit();

  const hooks: AddHooks = {
    onCarry: (iter, sum, carry) => {
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：无进位和 = a^b = ${sum}，进位 = (a&b)<<1 = ${carry}`,
          en: `Round ${iter + 1}: no-carry sum = a^b = ${sum}, carry = (a&b)<<1 = ${carry}`,
        })
        .setAux([
          { label: 'a ^ b (二进制)', value: bin32(sum), role: 'compare' },
          { label: '(a&b)<<1 (二进制)', value: bin32(carry), role: 'compare' },
          { label: '下一轮 a', value: String(sum), role: 'frontier' },
          { label: '下一轮 b', value: String(carry), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = add(a, b, hooks);

  rec
    .begin({
      zh: `进位归零，结果 = ${result}`,
      en: `Carry is zero; result = ${result}`,
    })
    .setAux([
      { label: 'a', value: String(a), role: 'default' },
      { label: 'b', value: String(b), role: 'default' },
      { label: 'a + b', value: String(result), role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}
