// =============================================================================
// 拉格朗日乘子法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lagrangeMultiplier, demoProblem, type LagrangeHooks } from './impl.ts';

export const DEFAULT_INPUT = { useDemo: true };

export function buildTrace(_input: { useDemo?: boolean } = {}): Frame[] {
  const rec = new TraceRecorder();
  const { f, constraints, x0, expect } = demoProblem();

  rec
    .begin({
      zh: `min f(x) s.t. g(x)=0，初值 [${x0.join(', ')}]`,
      en: `min f(x) s.t. g(x)=0, init [${x0.join(', ')}]`,
    })
    .setBars([
      { value: x0[0]!, role: 'compare' as BarRole, label: 'x0' },
      { value: x0[1]!, role: 'compare' as BarRole, label: 'x1' },
      { value: f(x0), role: 'final' as BarRole, label: 'f' },
    ])
    .commit();

  const hooks: LagrangeHooks = {
    onIteration: (iter, x, lambda, residual) => {
      rec
        .begin({
          zh: `迭代 ${iter + 1}：x=[${x.map((v) => v.toFixed(3)).join(', ')}]，λ=${lambda.map((v) => v.toFixed(3)).join(', ')}，残差 ${residual.toExponential(2)}`,
          en: `Iter ${iter + 1}: x=[${x.map((v) => v.toFixed(3)).join(', ')}], λ=${lambda.map((v) => v.toFixed(3)).join(', ')}, residual ${residual.toExponential(2)}`,
        })
        .setBars([
          ...x.map((v, i) => ({ value: v, role: 'compare' as BarRole, label: `x${i}` })),
          { value: lambda[0]!, role: 'pivot' as BarRole, label: 'λ' },
        ])
        .setAux([
          { label: '残差', value: residual.toExponential(2), role: 'warn' as BarRole },
          { label: 'f(x)', value: f(x).toFixed(4), role: 'final' as BarRole },
          {
            label: '期望最优',
            value: expect.map((v) => v.toFixed(2)).join(','),
            role: 'frontier' as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = lagrangeMultiplier(f, constraints, x0, { maxIterations: 50 }, hooks);

  rec
    .begin({
      zh: result.converged
        ? `收敛：x=[${result.x.map((v) => v.toFixed(3)).join(', ')}]，λ=[${result.lambda.map((v) => v.toFixed(3)).join(', ')}]，${result.iterations} 迭代`
        : `完成`,
      en: result.converged
        ? `Converged: x=[${result.x.map((v) => v.toFixed(3)).join(', ')}], λ=[${result.lambda.map((v) => v.toFixed(3)).join(', ')}], ${result.iterations} iters`
        : `Done`,
    })
    .setBars(
      result.x.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: `x${i}=${v.toFixed(2)}`,
      })),
    )
    .setAux([
      { label: 'f*', value: result.value.toFixed(4), role: 'final' as BarRole },
      {
        label: 'λ',
        value: result.lambda.map((v) => v.toFixed(3)).join(', '),
        role: 'pivot' as BarRole,
      },
      { label: '残差', value: result.residual.toExponential(2), role: 'warn' as BarRole },
    ])
    .commit();

  return rec.build();
}
