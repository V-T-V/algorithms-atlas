// =============================================================================
// Goldstein 条件线搜索 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { goldsteinLineSearch, type Vec, type GoldsteinHooks } from './impl.ts';

export const DEFAULT_INPUT: {
  x0: Vec;
  p: Vec;
  c: number;
  alphaMax: number;
  maxIter: number;
  alpha0: number;
} = {
  // f(x,y) = (x-3)^2 + (y-1)^2，最优 (3,1)
  x0: [0, 1],
  p: [1, 0],
  c: 0.1,
  alphaMax: 10,
  maxIter: 50,
  alpha0: 1,
};

function f(x: Vec): number {
  return (x[0]! - 3) ** 2 + (x[1]! - 1) ** 2;
}
function grad(x: Vec): Vec {
  return [2 * (x[0]! - 3), 2 * (x[1]! - 1)];
}

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { x0, p, c, alphaMax, maxIter, alpha0 } = input;

  const fx0 = f(x0);
  const gx0 = grad(x0);
  const dphi0 = gx0[0]! * p[0]! + gx0[1]! * p[1]!;

  rec
    .begin({
      zh: `起点 x=${x0.join(',')}，方向 p=${p.join(',')}，c=${c}`,
      en: `Start x=${x0.join(',')}, direction p=${p.join(',')}, c=${c}`,
    })
    .setAux([
      { label: 'f(x)', value: fx0.toFixed(4), role: 'pivot' as BarRole },
      { label: 'c', value: String(c), role: 'compare' as BarRole },
      { label: 'gᵀp', value: dphi0.toFixed(3), role: 'warn' as BarRole },
      { label: '上界斜率', value: (c * dphi0).toFixed(3) },
      { label: '下界斜率', value: ((1 - c) * dphi0).toFixed(3) },
    ])
    .commit();

  const hooks: GoldsteinHooks = {
    onTrial: (alpha, fnew, status) => {
      const upper = fx0 + c * alpha * dphi0;
      const lower = fx0 + (1 - c) * alpha * dphi0;
      rec
        .begin({
          zh: `试 α=${alpha.toFixed(5)}：f=${fnew.toFixed(4)}（${status === 'upper' ? '过大' : status === 'lower' ? '过小' : '接受'}）`,
          en: `Try α=${alpha.toFixed(5)}: f=${fnew.toFixed(4)} (${status === 'upper' ? 'too large' : status === 'lower' ? 'too small' : 'accepted'})`,
        })
        .setAux([
          { label: 'α', value: alpha.toFixed(5), role: 'pivot' as BarRole },
          { label: 'f(x+αp)', value: fnew.toFixed(4), role: 'compare' as BarRole },
          { label: '上界', value: upper.toFixed(4), role: 'final' as BarRole },
          { label: '下界', value: lower.toFixed(4), role: 'final' as BarRole },
          {
            label: '状态',
            value: status,
            role: status === 'ok' ? ('sorted' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit();
    },
  };

  const result = goldsteinLineSearch(f, x0, fx0, gx0, p, { c, alphaMax, maxIter, alpha0 }, hooks);

  rec
    .begin({
      zh: result.accepted
        ? `接受 α=${result.alpha.toFixed(5)}，f=${result.fnew.toFixed(4)}（${result.iterations} 步）`
        : `回退 α=${result.alpha.toFixed(5)}`,
      en: result.accepted
        ? `Accepted α=${result.alpha.toFixed(5)}, f=${result.fnew.toFixed(4)} (${result.iterations} steps)`
        : `Fallback α=${result.alpha.toFixed(5)}`,
    })
    .setAux([
      { label: 'α*', value: result.alpha.toFixed(5), role: 'final' as BarRole },
      { label: 'f*', value: result.fnew.toFixed(4), role: 'final' as BarRole },
      { label: 'iters', value: String(result.iterations), role: 'pivot' as BarRole },
      { label: 'accepted', value: String(result.accepted), role: 'sorted' as BarRole },
    ])
    .commit();

  return rec.build();
}
