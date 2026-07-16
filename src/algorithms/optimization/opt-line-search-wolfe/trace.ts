// =============================================================================
// Wolfe 条件线搜索 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wolfeLineSearch, type Vec, type WolfeHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  x0: Vec;
  p: Vec;
  c1: number;
  c2: number;
  alphaMax: number;
  maxIter: number;
} = {
  // Rosenbrock-f 风格：f(x,y) = (x-3)^2 + (y-1)^2，最优点 (3,1)
  // 起点选 (0,1)，方向 p=(1,0)
  x0: [0, 1],
  p: [1, 0],
  c1: 1e-4,
  c2: 0.9,
  alphaMax: 10,
  maxIter: 40,
};

function rosenbrockSphere(x: Vec): number {
  return (x[0]! - 3) ** 2 + (x[1]! - 1) ** 2;
}
function rosenbrockSphereGrad(x: Vec): Vec {
  return [2 * (x[0]! - 3), 2 * (x[1]! - 1)];
}

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x0, p, c1, c2, alphaMax, maxIter } = input;

  const fx0 = rosenbrockSphere(x0);
  const gx0 = rosenbrockSphereGrad(x0);
  const dphi0 = gx0.reduce((s, v, i) => s + v * p[i]!, 0);

  rec
    .begin({
      zh: `起点 x=${x0.join(',')}，方向 p=${p.join(',')}，gᵀp=${dphi0.toFixed(3)}（下降方向）`,
      en: `Start x=${x0.join(',')}, direction p=${p.join(',')}, gᵀp=${dphi0.toFixed(3)} (descent dir)`,
    })
    .setAux([
      { label: 'f(x)', value: fx0.toFixed(4), role: 'pivot' as BarRole },
      { label: 'c1', value: String(c1), role: 'compare' as BarRole },
      { label: 'c2', value: String(c2), role: 'compare' as BarRole },
      { label: 'gᵀp', value: dphi0.toFixed(3), role: 'warn' as BarRole },
    ])
    .commit();

  const hooks: WolfeHooks = {
    onTrial: (phase, alpha, fnew, deri) => {
      rec
        .begin({
          zh: `${phase === 'bracket' ? '扩界' : '缩界 zoom'} α=${alpha.toFixed(5)}，f=${fnew.toFixed(4)}，方向导数=${deri.toFixed(3)}`,
          en: `${phase === 'bracket' ? 'Bracket' : 'Zoom'} α=${alpha.toFixed(5)}, f=${fnew.toFixed(4)}, dir-deriv=${deri.toFixed(3)}`,
        })
        .setAux([
          { label: 'phase', value: phase, role: 'pivot' as BarRole },
          { label: 'α', value: alpha.toFixed(5), role: 'compare' as BarRole },
          { label: 'f(x+αp)', value: fnew.toFixed(4), role: 'compare' as BarRole },
          { label: "φ'(α)", value: deri.toFixed(3), role: 'final' as BarRole },
          { label: 'Armijo?', value: fnew <= fx0 + c1 * alpha * dphi0 ? 'yes' : 'no' },
          { label: 'curvature?', value: Math.abs(deri) <= -c2 * dphi0 ? 'yes' : 'no' },
        ])
        .commit();
    },
  };

  const result = wolfeLineSearch(
    rosenbrockSphere,
    rosenbrockSphereGrad,
    x0,
    fx0,
    gx0,
    p,
    { c1, c2, alphaMax, maxIter },
    hooks,
  );

  rec
    .begin({
      zh: result.accepted
        ? `接受 α=${result.alpha.toFixed(5)}，f=${result.fnew.toFixed(4)}（${result.iterations} 次试探）`
        : `回退 α=${result.alpha.toFixed(5)}，f=${result.fnew.toFixed(4)}`,
      en: result.accepted
        ? `Accepted α=${result.alpha.toFixed(5)}, f=${result.fnew.toFixed(4)} (${result.iterations} trials)`
        : `Fallback α=${result.alpha.toFixed(5)}, f=${result.fnew.toFixed(4)}`,
    })
    .setAux([
      { label: 'α*', value: result.alpha.toFixed(5), role: 'final' as BarRole },
      { label: 'f*', value: result.fnew.toFixed(4), role: 'final' as BarRole },
      { label: 'trials', value: String(result.iterations), role: 'pivot' as BarRole },
      { label: 'accepted', value: String(result.accepted), role: 'sorted' as BarRole },
    ])
    .commit();

  return rec.build();
}
