// =============================================================================
// 割线法 · 录制帧序列
// 演示求 x² − 2 = 0 的根（√2），用两点割线逼近。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secant, type SecantHooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 1, x1: 2, problem: 'sqrt2' as const };

interface Problem {
  f: (x: number) => number;
  label: string;
  trueRoot: number;
}
const PROBLEMS: Record<string, Problem> = {
  sqrt2: {
    f: (x) => x * x - 2,
    label: '求 √2：解 x² − 2 = 0',
    trueRoot: Math.SQRT2,
  },
  cubic: {
    f: (x) => x * x * x - x - 1,
    label: '解 x³ − x − 1 = 0',
    trueRoot: 1.324717957244746,
  },
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { x0: number; x1: number; problem?: keyof typeof PROBLEMS } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const prob = PROBLEMS[input.problem ?? 'sqrt2']!;
  const { x0, x1 } = input;

  rec
    .begin({
      zh: `${prob.label}，初值 x₀ = ${x0}, x₁ = ${x1}`,
      en: `${prob.label}, initial x₀ = ${x0}, x₁ = ${x1}`,
    })
    .setAux([
      {
        label: '迭代公式',
        value: 'x_{n+1} = x_n − f(x_n)·(x_n−x_{n−1})/(f(x_n)−f(x_{n−1}))',
        role: 'pivot',
      },
    ])
    .commit();

  const xs: number[] = [x0, x1];
  const xsRoles: BarRole[] = ['pivot', 'pivot'];

  const hooks: SecantHooks = {
    onIter: ({ iter, x, fx, next }) => {
      xs.push(next);
      xsRoles.push('frontier');
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：x = ${x.toFixed(10)}, f(x) = ${fx.toExponential(3)} → 下一个 x = ${next.toFixed(10)}`,
          en: `Iter ${iter + 1}: x = ${x.toFixed(10)}, f(x) = ${fx.toExponential(3)} → next x = ${next.toFixed(10)}`,
        })
        .setBars(xs.map((v, i) => ({ value: v, role: xsRoles[i]! })))
        .setAux([
          { label: `x_${iter + 1}`, value: x.toFixed(12), role: 'pivot' },
          { label: `f(x_${iter + 1})`, value: fx.toExponential(4), role: 'compare' },
          { label: `x_${iter + 2}`, value: next.toFixed(12), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = secant(prob.f, x0, x1, { tol: 1e-12, maxIter: 50 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得根 ≈ ${result.root}（真值 ≈ ${prob.trueRoot}）`
        : '未在给定迭代数内收敛',
      en: result.converged
        ? `Converged in ${result.iterations} iters: root ≈ ${result.root} (true ≈ ${prob.trueRoot})`
        : `Did not converge within maxIter`,
    })
    .setBars(
      xs.map((v, i) => ({
        value: v,
        role: (i === xs.length - 1 ? 'final' : 'default') as BarRole,
      })),
    )
    .setAux([
      { label: '近似根', value: result.root.toFixed(12), role: 'final' },
      { label: '迭代轮数', value: String(result.iterations), role: 'final' },
      { label: '是否收敛', value: result.converged ? '是 yes' : '否 no', role: 'final' },
      { label: '真值', value: prob.trueRoot.toFixed(12), role: 'final' },
    ])
    .commit();

  return rec.build();
}
