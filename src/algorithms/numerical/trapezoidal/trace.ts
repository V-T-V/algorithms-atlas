// =============================================================================
// 梯形积分 · 录制帧序列
// 用 setBars 展示函数采样点（当前条带两端高亮），setAux 展示累计积分。
// 默认演示：∫₀¹ 4/(1+x²) dx = π ≈ 3.1415926535...
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trapezoidal, type TrapezoidalHooks } from './impl.ts';

/** 内置问题集。 */
interface Problem {
  f: (x: number) => number;
  label: string;
  trueValue: number;
}
const PROBLEMS: Record<string, Problem> = {
  pi: {
    f: (x) => 4 / (1 + x * x),
    label: '∫₀¹ 4/(1+x²) dx（= π）',
    trueValue: Math.PI,
  },
  linear: {
    f: (x) => 2 * x,
    label: '∫₀³ 2x dx（= 9，精确）',
    trueValue: 9,
  },
};

export interface TrapezoidalInput {
  a: number;
  b: number;
  n: number;
  problem?: keyof typeof PROBLEMS;
}

export const DEFAULT_INPUT: TrapezoidalInput = { a: 0, b: 1, n: 8, problem: 'pi' };

/** 录制演示帧序列。 */
export function buildTrace(input: TrapezoidalInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const problemKey = input.problem ?? 'pi';
  const prob = PROBLEMS[problemKey]!;
  const a = input.a;
  const b = input.b;
  const n = input.n;

  rec
    .begin({
      zh: `${prob.label}，n = ${n} 个梯形条带`,
      en: `${prob.label}, n = ${n} trapezoid strips`,
    })
    .setAux([
      { label: '公式 / formula', value: '(h/2)·(f₀ + 2·Σfᵢ + fₙ)', role: 'pivot' },
      { label: 'a', value: String(a), role: 'compare' },
      { label: 'b', value: String(b), role: 'compare' },
      { label: '条带数 n', value: String(n), role: 'compare' },
    ])
    .commit();

  const hooks: TrapezoidalHooks = {
    onStrip: (s) => {
      const roles: Record<number, BarRole> = {};
      const labels: Record<number, string> = {};
      const h = s.h;
      const xs = Array.from({ length: n + 1 }, (_, i) => a + i * h);
      const fs = xs.map((x) => prob.f(x));
      for (let i = 0; i <= n; i++) {
        labels[i] = xs[i]!.toFixed(2);
        if (i === s.i || i === s.i + 1) roles[i] = 'compare';
      }
      rec
        .begin({
          zh: `条带 ${s.i + 1}/${n}：[${s.x0.toFixed(3)}, ${s.x1.toFixed(3)}]，面积 ${s.area.toFixed(6)}，累计 ${s.cumulative.toFixed(6)}`,
          en: `Strip ${s.i + 1}/${n}: [${s.x0.toFixed(3)}, ${s.x1.toFixed(3)}], area ${s.area.toFixed(6)}, cumulative ${s.cumulative.toFixed(6)}`,
        })
        .setBars(rec.barsFrom(fs, roles, labels))
        .setAux([
          { label: '步长 h', value: s.h.toFixed(6), role: 'compare' },
          { label: 'f(左)', value: s.f0.toFixed(6), role: 'compare' },
          { label: 'f(右)', value: s.f1.toFixed(6), role: 'compare' },
          { label: '本条带面积', value: s.area.toFixed(6), role: 'pivot' },
          { label: '累计积分', value: s.cumulative.toFixed(6), role: 'final' },
        ])
        .commit();
    },
  };

  const result = trapezoidal(prob.f, a, b, n, hooks);

  rec
    .begin({
      zh: `积分完成：≈ ${result.integral.toFixed(10)}（真值 ≈ ${prob.trueValue.toFixed(10)}，误差 ${Math.abs(result.integral - prob.trueValue).toExponential(3)}）`,
      en: `Done: ≈ ${result.integral.toFixed(10)} (true ≈ ${prob.trueValue.toFixed(10)}, error ${Math.abs(result.integral - prob.trueValue).toExponential(3)})`,
    })
    .setBars(
      result.fs.map((v, i) => ({
        value: v,
        role: (i === 0 || i === result.n ? 'final' : 'default') as BarRole,
        label: result.xs[i]!.toFixed(2),
      })),
    )
    .setAux([
      { label: '积分值', value: result.integral.toFixed(10), role: 'final' },
      { label: '条带数 n', value: String(result.n), role: 'final' },
      { label: '步长 h', value: result.h.toFixed(6), role: 'compare' },
      { label: '真值', value: prob.trueValue.toFixed(10), role: 'pivot' },
    ])
    .commit();

  return rec.build();
}
