// =============================================================================
// 二分法求根 · 录制帧序列
// 通过 bisection 的钩子，把区间折半过程录成 Frame[]。
// 可视化：setAux 展示当前 [lo, mid, hi]、f(mid)、区间宽度；
// setBars 展示历史 mid 值序列（体现逐步逼近）。
// 默认演示求 √2，即在 [1, 2] 上解 x² − 2 = 0。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bisection, type BisectionHooks } from './impl.ts';

export const DEFAULT_INPUT = { lo: 1, hi: 2, problem: 'sqrt2' as const };

/** 内置问题集。 */
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
  input: { lo: number; hi: number; problem?: keyof typeof PROBLEMS } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const problemKey = input.problem ?? 'sqrt2';
  const prob = PROBLEMS[problemKey]!;
  const lo0 = input.lo;
  const hi0 = input.hi;

  // 历史 mid 值（柱状图体现收敛）
  const mids: number[] = [];
  const midsRoles: BarRole[] = [];

  rec
    .begin({
      zh: `${prob.label}，初始区间 [${lo0}, ${hi0}]（两端 f 异号 → 含根）`,
      en: `${prob.label}, bracket [${lo0}, ${hi0}] (signs differ → contains root)`,
    })
    .setAux([
      { label: '策略', value: '中点折半，保留含根的一半', role: 'pivot' },
      { label: 'f(lo₀)', value: prob.f(lo0).toFixed(6), role: 'compare' },
      { label: 'f(hi₀)', value: prob.f(hi0).toFixed(6), role: 'compare' },
    ])
    .commit();

  const hooks: BisectionHooks = {
    onShrink: (step) => {
      mids.push(step.mid);
      midsRoles.push('frontier');
      rec
        .begin({
          zh: `第 ${step.iter} 轮：mid = ${step.mid}，f(mid) = ${step.fmid.toExponential(3)} → 新区间 [${step.newLo}, ${step.newHi}]（宽度 ${step.newHi - step.newLo}）`,
          en: `Iter ${step.iter}: mid = ${step.mid}, f(mid) = ${step.fmid.toExponential(3)} → new bracket [${step.newLo}, ${step.newHi}] (width ${step.newHi - step.newLo})`,
        })
        .setBars(mids.map((v, i) => ({ value: v, role: midsRoles[i]! })))
        .setAux([
          { label: 'lo', value: step.lo.toFixed(12), role: 'pivot' },
          { label: 'mid', value: step.mid.toFixed(12), role: 'compare' },
          { label: 'hi', value: step.hi.toFixed(12), role: 'pivot' },
          { label: 'f(mid)', value: step.fmid.toExponential(4), role: 'compare' },
          { label: '区间宽度', value: (step.hi - step.lo).toExponential(4), role: 'frontier' },
        ])
        .commit();
    },
  };

  const result = bisection(prob.f, lo0, hi0, { tol: 1e-12, maxIter: 100 }, hooks);

  // 终态：高亮最后的 mid 为 final
  if (midsRoles.length > 0) midsRoles[midsRoles.length - 1] = 'final';

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得根 ≈ ${result.root}（真值 ≈ ${prob.trueRoot}，终区间宽度 ${result.width.toExponential(3)}）`
        : `未收敛（终区间宽度 ${result.width.toExponential(3)}）`,
      en: result.converged
        ? `Converged in ${result.iterations} iters: root ≈ ${result.root} (true ≈ ${prob.trueRoot}, final width ${result.width.toExponential(3)})`
        : `Not converged (final width ${result.width.toExponential(3)})`,
    })
    .setBars(mids.map((v, i) => ({ value: v, role: midsRoles[i]! })))
    .setAux([
      { label: '近似根', value: result.root.toFixed(12), role: 'final' },
      { label: '迭代轮数', value: String(result.iterations), role: 'final' },
      { label: '是否收敛', value: result.converged ? '是 yes' : '否 no', role: 'final' },
      { label: '真值', value: prob.trueRoot.toFixed(12), role: 'final' },
    ])
    .commit();

  return rec.build();
}
