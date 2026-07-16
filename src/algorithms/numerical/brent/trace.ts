// =============================================================================
// Brent 方法 · 录制帧序列
// 演示在变号区间内用 IQI / 割线 / 二分 自适应求根（示例：x² − 2 = 0）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { brent, type BrentHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 1, b: 2, problem: 'sqrt2' as const };

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

const METHOD_LABEL: Record<string, string> = {
  iqi: '逆二次插值',
  secant: '割线',
  bisection: '二分',
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { a: number; b: number; problem?: keyof typeof PROBLEMS } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const prob = PROBLEMS[input.problem ?? 'sqrt2']!;
  const { a, b } = input;

  rec
    .begin({
      zh: `${prob.label}，区间 [${a}, ${b}]（Brent 自适应求根）`,
      en: `${prob.label}, bracket [${a}, ${b}] (adaptive Brent)`,
    })
    .setAux([{ label: '策略', value: '优先 IQI，退化为割线，再退化为二分', role: 'pivot' }])
    .commit();

  const hooks: BrentHooks = {
    onStep: ({ iter, a: aa, b: bb, method, s, fb }) => {
      rec
        .begin({
          zh: `第 ${iter + 1} 轮：b=${bb.toFixed(10)}, f(b)=${fb.toExponential(3)}，采用「${METHOD_LABEL[method]}」→ 新点 s=${s.toFixed(10)}`,
          en: `Iter ${iter + 1}: b=${bb.toFixed(10)}, f(b)=${fb.toExponential(3)}, using ${method} → s=${s.toFixed(10)}`,
        })
        .setAux([
          { label: '当前 a', value: aa.toFixed(12), role: 'compare' },
          { label: '当前 b', value: bb.toFixed(12), role: 'pivot' },
          { label: '本步方法', value: method, role: 'frontier' },
          { label: '新点 s', value: s.toFixed(12), role: 'frontier' },
        ] as Array<{ label: string; value: string; role?: BarRole }>)
        .commit();
    },
  };

  const result = brent(prob.f, a, b, { tol: 1e-12, maxIter: 80 }, hooks);
  const methodCount: Record<string, number> = { iqi: 0, secant: 0, bisection: 0 };
  for (const s of result.steps) methodCount[s.method]!++;

  rec
    .begin({
      zh: result.converged
        ? `收敛：${result.iterations} 轮后得根 ≈ ${result.root}（真值 ≈ ${prob.trueRoot}）`
        : '未在给定迭代数内收敛',
      en: result.converged
        ? `Converged in ${result.iterations} iters: root ≈ ${result.root} (true ≈ ${prob.trueRoot})`
        : `Did not converge`,
    })
    .setAux([
      { label: '近似根', value: result.root.toFixed(12), role: 'final' },
      { label: '迭代轮数', value: String(result.iterations), role: 'final' },
      { label: '是否收敛', value: result.converged ? '是 yes' : '否 no', role: 'final' },
      { label: 'IQI 次数', value: String(methodCount.iqi), role: 'compare' },
      { label: '割线次数', value: String(methodCount.secant), role: 'compare' },
      { label: '二分次数', value: String(methodCount.bisection), role: 'compare' },
    ] as Array<{ label: string; value: string; role?: BarRole }>)
    .commit();

  return rec.build();
}
