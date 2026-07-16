// =============================================================================
// 辛普森积分 · 录制帧序列
// 用 setBars 展示函数采样点（每个三元组中点标 compare），setAux 展示积分累加。
// 默认演示：∫₀¹ 4/(1+x²) dx = π ≈ 3.1415926535...
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simpsonIntegral, type SimpsonHooks } from './impl.ts';

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
  cubic: {
    f: (x) => x * x * x,
    label: '∫₀² x³ dx（= 4，精确）',
    trueValue: 4,
  },
};

export interface SimpsonInput {
  a: number;
  b: number;
  n: number;
  problem?: keyof typeof PROBLEMS;
}

export const DEFAULT_INPUT: SimpsonInput = { a: 0, b: 1, n: 8, problem: 'pi' };

/** 录制演示帧序列。 */
export function buildTrace(input: SimpsonInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const problemKey = input.problem ?? 'pi';
  const prob = PROBLEMS[problemKey]!;
  const a = input.a;
  const b = input.b;
  const n = input.n;

  rec
    .begin({
      zh: `${prob.label}，n = ${n} 子区间`,
      en: `${prob.label}, n = ${n} subintervals`,
    })
    .setAux([
      { label: '公式 / formula', value: '(h/3)·(f₀ + 4·Σ奇 + 2·Σ偶 + fₙ)', role: 'pivot' },
      { label: 'a', value: String(a), role: 'compare' },
      { label: 'b', value: String(b), role: 'compare' },
      { label: '子区间数 n', value: String(n), role: 'compare' },
    ])
    .commit();

  let cumulative = 0;

  const hooks: SimpsonHooks = {
    onPanel: (p) => {
      cumulative = p.cumulative;
      // 高亮当前三元组中点
      const roles: Record<number, BarRole> = {};
      const labels: Record<number, string> = {};
      // 在采样点中找出对应的三个下标（按 x 匹配）
      rec.begin({
        zh: `三元组 [${p.a.toFixed(3)}, ${p.mid.toFixed(3)}, ${p.b.toFixed(3)}]：贡献 ${p.contribution.toFixed(6)}，累计 ${p.cumulative.toFixed(6)}`,
        en: `Panel [${p.a.toFixed(3)}, ${p.mid.toFixed(3)}, ${p.b.toFixed(3)}]: contrib ${p.contribution.toFixed(6)}, cumulative ${p.cumulative.toFixed(6)}`,
      });
      // 重建采样点条形（值用函数值）
      const nn = n;
      const h = p.h;
      const xs = Array.from({ length: nn + 1 }, (_, i) => a + i * h);
      const fs = xs.map((x) => prob.f(x));
      // 找到三元组下标
      for (let i = 0; i <= nn; i++) {
        if (Math.abs(xs[i]! - p.a) < 1e-12) roles[i] = 'frontier';
        else if (Math.abs(xs[i]! - p.mid) < 1e-12) roles[i] = 'compare';
        else if (Math.abs(xs[i]! - p.b) < 1e-12) roles[i] = 'frontier';
        labels[i] = xs[i]!.toFixed(2);
      }
      rec
        .setBars(rec.barsFrom(fs, roles, labels))
        .setAux([
          { label: '步长 h', value: p.h.toFixed(6), role: 'compare' },
          { label: 'f(左)', value: p.fa.toFixed(6), role: 'frontier' },
          { label: 'f(中)', value: p.fmid.toFixed(6), role: 'compare' },
          { label: 'f(右)', value: p.fb.toFixed(6), role: 'frontier' },
          { label: '本段贡献', value: p.contribution.toFixed(6), role: 'pivot' },
          { label: '累计积分', value: p.cumulative.toFixed(6), role: 'final' },
        ])
        .commit();
    },
  };

  const result = simpsonIntegral(prob.f, a, b, n, hooks);

  // 终态：全部采样点 + 总积分值
  const roles: Record<number, BarRole> = { 0: 'final' };
  roles[result.n] = 'final';
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
      { label: '子区间数 n', value: String(result.n), role: 'final' },
      { label: '步长 h', value: result.h.toFixed(6), role: 'compare' },
      { label: '真值', value: prob.trueValue.toFixed(10), role: 'pivot' },
      { label: '累计（参考）', value: cumulative.toFixed(10), role: 'final' },
    ])
    .commit();

  return rec.build();
}
