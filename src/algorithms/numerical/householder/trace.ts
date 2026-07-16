// =============================================================================
// Householder 方法 · 录制帧序列
// 演示用 Halley（三阶）求 √2，对比牛顿法的快速收敛。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { householder, type HouseholderHooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 1.5, problem: 'sqrt2' as const };

interface Problem {
  f: (x: number) => number;
  df: (x: number) => number;
  d2f: (x: number) => number;
  label: string;
  trueRoot: number;
}
const PROBLEMS: Record<string, Problem> = {
  sqrt2: {
    f: (x) => x * x - 2,
    df: (x) => 2 * x,
    d2f: () => 2,
    label: '求 √2：解 x² − 2 = 0',
    trueRoot: Math.SQRT2,
  },
  cubic: {
    f: (x) => x * x * x - x - 1,
    df: (x) => 3 * x * x - 1,
    d2f: (x) => 6 * x,
    label: '解 x³ − x − 1 = 0',
    trueRoot: 1.324717957244746,
  },
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { x0: number; problem?: keyof typeof PROBLEMS } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const prob = PROBLEMS[input.problem ?? 'sqrt2']!;
  const x0 = input.x0;

  rec
    .begin({
      zh: `${prob.label}，初值 x₀ = ${x0}（Halley 三阶迭代）`,
      en: `${prob.label}, initial x₀ = ${x0} (Halley, cubic convergence)`,
    })
    .setAux([
      { label: '迭代公式', value: "x_{n+1} = x_n − 2·f·f' / (2·f'² − f·f'')", role: 'pivot' },
      { label: '初值 x₀', value: String(x0), role: 'pivot' },
    ])
    .commit();

  const xs: number[] = [x0];
  const xsRoles: BarRole[] = ['pivot'];

  const hooks: HouseholderHooks = {
    onIter: ({ iter, x, fx, next }) => {
      xs.push(next);
      xsRoles.push('frontier');
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：x = ${x}, f(x) = ${fx.toExponential(3)} → 下一个 x = ${next}`,
          en: `Iter ${iter + 1}: x = ${x}, f(x) = ${fx.toExponential(3)} → next x = ${next}`,
        })
        .setBars(xs.map((v, i) => ({ value: v, role: xsRoles[i]! })))
        .setAux([
          { label: `x_${iter}`, value: x.toFixed(12), role: 'pivot' },
          { label: `f(x_${iter})`, value: fx.toExponential(4), role: 'compare' },
          { label: `x_${iter + 1}`, value: next.toFixed(12), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = householder(
    prob.f,
    prob.df,
    prob.d2f,
    x0,
    { order: 2, tol: 1e-15, maxIter: 30 },
    hooks,
  );

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得根 ≈ ${result.root}（真值 ≈ ${prob.trueRoot}）`
        : '未在给定迭代数内收敛',
      en: result.converged
        ? `Converged in ${result.iterations} iters: root ≈ ${result.root} (true ≈ ${prob.trueRoot})`
        : `Did not converge`,
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
