// =============================================================================
// 迭代 GCD · 录制帧序列
// 用 setAux 展示每步 (a,b) → (b, a%b) 的替换过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gcd, type GcdHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number; b: number } = { a: 252, b: 105 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a: A, b: B } = input;

  rec
    .begin({
      zh: `求 GCD(${A}, ${B})：迭代欧几里得 while (b≠0) { (a,b)=(b,a%b) }`,
      en: `Compute GCD(${A}, ${B}): iterative Euclidean while (b≠0) { (a,b)=(b,a%b) }`,
    })
    .setAux([
      { label: '初始 a', value: String(A), role: 'pivot' as BarRole },
      { label: '初始 b', value: String(B), role: 'frontier' as BarRole },
      { label: '步数', value: '0', role: 'compare' as BarRole },
    ])
    .commit();

  let finalGcd = 0;
  const hooks: GcdHooks = {
    onStep: (step, a, b) => {
      rec
        .begin({
          zh: `步骤 ${step}：当前 (a, b) = (${a}, ${b})${b !== 0 ? `，下一轮将变为 (b, a%b) = (${b}, ${a % b})` : '，b=0 → 终止'}`,
          en: `Step ${step}: (a, b) = (${a}, ${b})${b !== 0 ? `, next will be (b, a%b) = (${b}, ${a % b})` : ', b=0 → stop'}`,
        })
        .setAux([
          { label: '当前 a', value: String(a), role: 'pivot' as BarRole },
          { label: '当前 b', value: String(b), role: (b === 0 ? 'final' : 'frontier') as BarRole },
          { label: '步数', value: String(step), role: 'compare' as BarRole },
          ...(b !== 0 ? [{ label: 'a % b', value: String(a % b), role: 'compare' as const }] : []),
        ])
        .commit();
    },
    onResult: (g) => {
      finalGcd = g;
    },
  };

  gcd(A, B, hooks);

  // 终态
  rec
    .begin({
      zh: `完成。GCD(${A}, ${B}) = ${finalGcd}`,
      en: `Done. GCD(${A}, ${B}) = ${finalGcd}`,
    })
    .setAux([
      { label: 'GCD', value: String(finalGcd), role: 'final' as BarRole },
      { label: 'a / GCD', value: String(A / finalGcd), role: 'compare' as BarRole },
      { label: 'b / GCD', value: String(B / finalGcd), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
