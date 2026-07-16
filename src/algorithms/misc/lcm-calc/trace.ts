// =============================================================================
// 最小公倍数 · 录制帧序列
// 用 setAux 展示「求 GCD → 先除后乘 → 得 LCM」的过程。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lcm, type LcmHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number; b: number } = { a: 12, b: 18 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a: A, b: B } = input;

  rec
    .begin({
      zh: `求 LCM(${A}, ${B})：先求 GCD，再 LCM = (a / GCD) * b（先除后乘防溢出）`,
      en: `Compute LCM(${A}, ${B}): find GCD first, then LCM = (a / GCD) * b (divide-before-multiply to avoid overflow)`,
    })
    .setAux([
      { label: 'a', value: String(A), role: 'pivot' as BarRole },
      { label: 'b', value: String(B), role: 'frontier' as BarRole },
      { label: '阶段', value: '求 GCD', role: 'compare' as BarRole },
    ])
    .commit();

  let finalLcm = 0;
  const hooks: LcmHooks = {
    onGcd: (a, b, g) => {
      rec
        .begin({
          zh: `GCD(${a}, ${b}) = ${g}。现在 LCM = (a / ${g}) * b = (${a / g}) * ${b}`,
          en: `GCD(${a}, ${b}) = ${g}. Now LCM = (a / ${g}) * b = (${a / g}) * ${b}`,
        })
        .setAux([
          { label: 'GCD', value: String(g), role: 'compare' as BarRole },
          { label: 'a / GCD', value: String(a / g), role: 'frontier' as BarRole },
          { label: 'b', value: String(b), role: 'pivot' as BarRole },
          { label: '阶段', value: '先除后乘', role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onResult: (a, b, result) => {
      finalLcm = result;
    },
  };

  lcm(A, B, hooks);

  // 终态
  rec
    .begin({
      zh: `完成。LCM(${A}, ${B}) = ${finalLcm}（验证：${finalLcm}/${A}=${finalLcm / A}, ${finalLcm}/${B}=${finalLcm / B}）`,
      en: `Done. LCM(${A}, ${B}) = ${finalLcm} (check: ${finalLcm}/${A}=${finalLcm / A}, ${finalLcm}/${B}=${finalLcm / B})`,
    })
    .setAux([
      { label: 'LCM', value: String(finalLcm), role: 'final' as BarRole },
      { label: 'LCM / a', value: String(finalLcm / A), role: 'compare' as BarRole },
      { label: 'LCM / b', value: String(finalLcm / B), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
