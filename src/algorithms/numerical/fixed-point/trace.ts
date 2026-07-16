// =============================================================================
// 不动点迭代 · 录制帧序列
// 演示求 x = cos(x) 的不动点（Dottie 数 ≈ 0.739085）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fixedPoint, type FixedPointHooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 1, g: 'cos' as const };

interface Problem {
  g: (x: number) => number;
  label: string;
  trueRoot: number;
}
const PROBLEMS: Record<string, Problem> = {
  cos: {
    g: (x) => Math.cos(x),
    label: '求 x = cos(x)',
    trueRoot: 0.7390851332151607,
  },
  sqrt: {
    g: (x) => 0.5 * (x + 2 / x),
    label: '求 √2：x = (x + 2/x)/2',
    trueRoot: Math.SQRT2,
  },
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { x0: number; g?: keyof typeof PROBLEMS } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const prob = PROBLEMS[input.g ?? 'cos']!;
  const x0 = input.x0;

  rec
    .begin({
      zh: `${prob.label}，初值 x₀ = ${x0}`,
      en: `${prob.label}, initial x₀ = ${x0}`,
    })
    .setAux([
      { label: '迭代公式', value: 'x_{n+1} = g(x_n)', role: 'pivot' },
      { label: '初值 x₀', value: String(x0), role: 'pivot' },
    ])
    .commit();

  const xs: number[] = [x0];
  const xsRoles: BarRole[] = ['pivot'];

  const hooks: FixedPointHooks = {
    onIter: ({ iter, x, next }) => {
      xs.push(next);
      xsRoles.push('frontier');
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：x = ${x.toFixed(10)} → g(x) = ${next.toFixed(10)}`,
          en: `Iter ${iter + 1}: x = ${x.toFixed(10)} → g(x) = ${next.toFixed(10)}`,
        })
        .setBars(xs.map((v, i) => ({ value: v, role: xsRoles[i]! })))
        .setAux([
          { label: `x_${iter}`, value: x.toFixed(12), role: 'pivot' },
          { label: `x_${iter + 1}`, value: next.toFixed(12), role: 'frontier' },
          { label: `|Δx|`, value: Math.abs(next - x).toExponential(3), role: 'compare' },
        ])
        .commit();
    },
  };

  const result = fixedPoint(prob.g, x0, { tol: 1e-12, maxIter: 200 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得不动点 ≈ ${result.root}（真值 ≈ ${prob.trueRoot}）`
        : '未在给定迭代数内收敛',
      en: result.converged
        ? `Converged in ${result.iterations} iters: fixed point ≈ ${result.root} (true ≈ ${prob.trueRoot})`
        : `Did not converge within maxIter`,
    })
    .setBars(
      xs.map((v, i) => ({
        value: v,
        role: (i === xs.length - 1 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      { label: '不动点', value: result.root.toFixed(12), role: 'final' },
      { label: '迭代轮数', value: String(result.iterations), role: 'final' },
      { label: '是否收敛', value: result.converged ? '是 yes' : '否 no', role: 'final' },
    ])
    .commit();

  return rec.build();
}
