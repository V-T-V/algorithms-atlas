// =============================================================================
// 牛顿迭代法 · 录制帧序列
// 通过 newtonMethod 的钩子，把逐次迭代录成 Frame[]。
// 可视化：setAux 展示每轮 x_n / f(x_n) / f'(x_n) / x_{n+1}；
// setBars 展示历史 x 值序列（体现收敛）。
// 默认演示求 sqrt(2)，即解 x² - 2 = 0。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { newtonMethod, type NewtonMethodHooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 1.5, problem: 'sqrt2' as const };

/** 内置问题集：f, f' 以及对应的根（用于标注）。 */
interface Problem {
  f: (x: number) => number;
  df: (x: number) => number;
  label: string;
  trueRoot: number;
}
const PROBLEMS: Record<string, Problem> = {
  // 解 x² - 2 = 0 → 根为 √2 ≈ 1.4142...
  sqrt2: {
    f: (x) => x * x - 2,
    df: (x) => 2 * x,
    label: '求 √2：解 x² − 2 = 0',
    trueRoot: Math.SQRT2,
  },
  // 解 x³ - x - 1 = 0 → 根 ≈ 1.3247...
  cubic: {
    f: (x) => x * x * x - x - 1,
    df: (x) => 3 * x * x - 1,
    label: '解 x³ − x − 1 = 0',
    trueRoot: 1.324717957244746,
  },
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { x0: number; problem?: keyof typeof PROBLEMS } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const problemKey = input.problem ?? 'sqrt2';
  const prob = PROBLEMS[problemKey]!;
  const x0 = input.x0;

  rec
    .begin({
      zh: `${prob.label}，初值 x₀ = ${x0}`,
      en: `${prob.label}, initial x₀ = ${x0}`,
    })
    .setAux([
      { label: '迭代公式', value: "x_{n+1} = x_n − f(x_n)/f'(x_n)", role: 'pivot' },
      { label: '初值 x₀', value: String(x0), role: 'pivot' },
    ])
    .commit();

  // 历史 x 值（用于柱状图体现收敛），长度随迭代增长
  const xs: number[] = [x0];
  const xsRoles: BarRole[] = ['pivot'];

  const snapshotAfter = (step: {
    iter: number;
    x: number;
    fx: number;
    dfx: number;
    next: number;
  }): void => {
    xs.push(step.next);
    xsRoles.push('frontier');
    rec
      .begin({
        zh: `第 ${step.iter + 1} 轮：x = ${step.x}, f(x) = ${step.fx.toExponential(3)}, f'(x) = ${step.dfx.toExponential(3)} → 下一个 x = ${step.next}`,
        en: `Iter ${step.iter + 1}: x = ${step.x}, f(x) = ${step.fx.toExponential(3)}, f'(x) = ${step.dfx.toExponential(3)} → next x = ${step.next}`,
      })
      .setBars(xs.map((v, i) => ({ value: v, role: xsRoles[i]! })))
      .setAux([
        { label: `x_${step.iter}`, value: step.x.toFixed(12), role: 'pivot' },
        { label: `f(x_${step.iter})`, value: step.fx.toExponential(4), role: 'compare' },
        { label: `f'(x_${step.iter})`, value: step.dfx.toExponential(4), role: 'compare' },
        { label: `x_${step.iter + 1}`, value: step.next.toFixed(12), role: 'frontier' },
      ])
      .commit();
  };

  const hooks: NewtonMethodHooks = { onIter: snapshotAfter };

  const result = newtonMethod(prob.f, prob.df, x0, { tol: 1e-12, maxIter: 50 }, hooks);

  // 终态
  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得根 ≈ ${result.root}（真值 ≈ ${prob.trueRoot}）`
        : `未在给定迭代数内收敛`,
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
