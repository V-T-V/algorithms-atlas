// =============================================================================
// 位运算乘法 · 录制帧序列
// 演示一对操作数的「移位累加」过程；setAux 展示每位是否累加。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiply, type MultiplyHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 13, b: 11 };

const bin = (n: number): string => (n >>> 0).toString(2);

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  rec
    .begin({
      zh: `计算 ${a} × ${b}（移位累加，不使用 *）`,
      en: `Compute ${a} × ${b} (shift-and-add, no *)`,
    })
    .setAux([
      { label: '被乘数 a', value: `${a} (${bin(a)})`, role: 'pivot' },
      { label: '乘数 b', value: `${b} (${bin(b)})`, role: 'pivot' },
    ])
    .commit();

  const hooks: MultiplyHooks = {
    onBit: (step, bit, acc, curA) => {
      rec
        .begin({
          zh: `第 ${step + 1} 位：b 的该位 = ${bit}，${bit ? `累加 a = ${curA} → acc = ${acc}` : '不累加'}；a 左移一位`,
          en: `Bit ${step + 1}: b's bit = ${bit}, ${bit ? `add a = ${curA} → acc = ${acc}` : 'skip'}; shift a left`,
        })
        .setAux([
          { label: '当前 a', value: `${curA} (${bin(curA)})`, role: 'compare' },
          { label: '该位', value: String(bit), role: bit ? 'frontier' : 'warn' },
          { label: '累加 acc', value: String(acc), role: 'frontier' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const result = multiply(a, b, hooks);

  rec
    .begin({
      zh: `完成：${a} × ${b} = ${result}`,
      en: `Done: ${a} × ${b} = ${result}`,
    })
    .setAux([
      { label: 'a', value: String(a), role: 'default' },
      { label: 'b', value: String(b), role: 'default' },
      { label: 'a × b', value: String(result), role: 'final' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}
