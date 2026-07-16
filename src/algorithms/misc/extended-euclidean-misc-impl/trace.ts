// =============================================================================
// 扩展欧几里得 · 录制帧序列
// 用 setAux 展示每步 (a,b) 与 Bézout 系数 (x1,y1)/(x2,y2) 的同步演化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extGcd, type ExtGcdHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number; b: number } = { a: 240, b: 46 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a: A, b: B } = input;

  rec
    .begin({
      zh: `求 Bézout 系数：使 ${A}·x + ${B}·y = GCD(${A}, ${B})`,
      en: `Find Bézout coefficients: ${A}·x + ${B}·y = GCD(${A}, ${B})`,
    })
    .setAux([
      { label: 'a', value: String(A), role: 'pivot' as BarRole },
      { label: 'b', value: String(B), role: 'frontier' as BarRole },
      { label: '步数', value: '0', role: 'compare' as BarRole },
    ])
    .commit();

  let finalResult = { gcd: 0, x: 0, y: 0 };
  const hooks: ExtGcdHooks = {
    onStep: (step, ra, rb, x1, y1, x2, y2) => {
      rec
        .begin({
          zh: `步骤 ${step}：(r, r') = (${ra}, ${rb})，系数 (s,s') = (${x1}, ${x2})，(t,t') = (${y1}, ${y2})`,
          en: `Step ${step}: (r, r') = (${ra}, ${rb}), (s, s') = (${x1}, ${x2}), (t, t') = (${y1}, ${y2})`,
        })
        .setAux([
          { label: '当前 r (a 路径)', value: String(ra), role: 'pivot' as BarRole },
          {
            label: "r' (余数)",
            value: String(rb),
            role: (rb === 0 ? 'final' : 'frontier') as BarRole,
          },
          { label: 's (a 的系数)', value: String(x1), role: 'compare' as BarRole },
          { label: 't (b 的系数)', value: String(y1), role: 'compare' as BarRole },
          { label: "s'", value: String(x2), role: 'default' as BarRole },
          { label: "t'", value: String(y2), role: 'default' as BarRole },
          { label: '步数', value: String(step), role: 'compare' as BarRole },
        ])
        .commit();
    },
    onResult: (r) => {
      finalResult = r;
    },
  };

  extGcd(A, B, hooks);

  // 终态：验证 Bézout 恒等式
  const check = A * finalResult.x + B * finalResult.y;
  rec
    .begin({
      zh: `完成。GCD = ${finalResult.gcd}，x = ${finalResult.x}，y = ${finalResult.y}。验证：${A}·(${finalResult.x}) + ${B}·(${finalResult.y}) = ${check}`,
      en: `Done. GCD = ${finalResult.gcd}, x = ${finalResult.x}, y = ${finalResult.y}. Check: ${A}·(${finalResult.x}) + ${B}·(${finalResult.y}) = ${check}`,
    })
    .setAux([
      { label: 'GCD', value: String(finalResult.gcd), role: 'final' as BarRole },
      { label: 'x (a 系数)', value: String(finalResult.x), role: 'compare' as BarRole },
      { label: 'y (b 系数)', value: String(finalResult.y), role: 'compare' as BarRole },
      {
        label: 'Bézout 验证',
        value: String(check),
        role: (check === finalResult.gcd ? 'final' : 'warn') as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
