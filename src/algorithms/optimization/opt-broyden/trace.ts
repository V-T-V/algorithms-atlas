// =============================================================================
// Broyden 方法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { broyden, type BroydenHooks, type Vec } from './impl.ts';

// 求 F(x,y)=(x²−4, y²−9)=(0,0) → 解 (2,3)
export const DEFAULT_INPUT = {
  F: (x: Vec): Vec => [x[0]! ** 2 - 4, x[1]! ** 2 - 9],
  x0: [1, 1],
};

export function buildTrace(input: typeof DEFAULT_INPUT = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { F, x0 } = input;

  const r0 = Math.hypot(...F(x0));
  rec
    .begin({
      zh: `Broyden 求 F(x)=0，初始 (${x0.join(',')})，初始残差 ${r0.toFixed(4)}。`,
      en: `Broyden solving F(x)=0, init (${x0.join(',')}), residual ${r0.toFixed(4)}.`,
    })
    .setAux([
      { label: '初始点', value: `(${x0.join(',')})`, role: 'frontier' as BarRole },
      { label: '初始残差', value: r0.toFixed(6), role: 'pivot' as BarRole },
    ])
    .commit();

  const hooks: BroydenHooks = {
    onIter: (iter, x, residual, step) => {
      rec
        .begin({
          zh: `iter ${iter}：x=(${x.map((v) => v.toFixed(4)).join(',')}), 残差 ${residual.toFixed(6)}, 步长 ${step.toFixed(4)}`,
          en: `iter ${iter}: x=(${x.map((v) => v.toFixed(4)).join(',')}), residual ${residual.toFixed(6)}, step ${step.toFixed(4)}`,
        })
        .setAux([
          { label: 'iter', value: String(iter), role: 'pivot' as BarRole },
          {
            label: 'x',
            value: `(${x.map((v) => v.toFixed(4)).join(',')})`,
            role: 'compare' as BarRole,
          },
          { label: '|F|', value: residual.toFixed(6), role: 'final' as BarRole },
          { label: '步长', value: step.toFixed(4), role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };

  const result = broyden(F, x0, { maxIter: 100, tol: 1e-10 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：x=(${result.x.map((v) => v.toFixed(6)).join(',')}), 残差 ${result.residual.toExponential(2)}（${result.iterations} 步）`
        : `结束：x=(${result.x.map((v) => v.toFixed(6)).join(',')})`,
      en: result.converged
        ? `Converged: x=(${result.x.map((v) => v.toFixed(6)).join(',')}), residual ${result.residual.toExponential(2)} (${result.iterations} iters)`
        : `Stopped: x=(${result.x.map((v) => v.toFixed(6)).join(',')})`,
    })
    .setAux([
      {
        label: 'x',
        value: `(${result.x.map((v) => v.toFixed(6)).join(',')})`,
        role: 'final' as BarRole,
      },
      { label: '|F|', value: result.residual.toExponential(2), role: 'final' as BarRole },
      { label: '迭代', value: String(result.iterations), role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
