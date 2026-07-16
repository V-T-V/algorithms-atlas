// =============================================================================
// 斐波那契（黄金比公式）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fibonacciGolden, type FibonacciGoldenHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 20 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  let curA = 1n;
  let curB = 0n;

  rec
    .begin({ zh: `用 Binet 公式计算 F(${n})`, en: `Compute F(${n}) via Binet formula` })
    .setAux([{ label: 'n', value: String(n), role: 'frontier' }])
    .commit();

  const hooks: FibonacciGoldenHooks = {
    onStep: (bit, a, b) => {
      curA = a;
      curB = b;
      rec
        .begin({
          zh: `指数位 = ${bit}，当前 (1+√5)^累积 的系数 a=${a}, b=${b}`,
          en: `bit=${bit}, current (1+√5)^acc coeffs a=${a}, b=${b}`,
        })
        .setAux([
          { label: '位', value: String(bit), role: 'compare' },
          { label: 'a', value: a.toString(), role: 'frontier' },
          { label: 'b (√5 系数)', value: b.toString(), role: 'frontier' },
        ])
        .commit();
    },
  };

  const f = fibonacciGolden(n, hooks);

  rec
    .begin({ zh: `F(${n}) = ${f}`, en: `F(${n}) = ${f}` })
    .setAux([
      { label: `F(${n})`, value: f.toString(), role: 'final' },
      { label: '末轮 b', value: curB.toString(), role: 'default' },
      { label: '末轮 a', value: curA.toString(), role: 'default' },
    ])
    .commit();

  return rec.build();
}
