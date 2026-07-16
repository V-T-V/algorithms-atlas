// =============================================================================
// 狄利克雷卷积 · 录制帧序列
// 演示 μ * 1 = ε（单位函数），观察结果逐步累加。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dirichletConvolution, ones, epsilon, type DirichletHooks } from './impl.ts';
import { mobiusSieve } from '../mertens-function/impl.ts';

export const DEFAULT_INPUT: { N: number } = { N: 12 };

export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { N } = input;

  const mu = mobiusSieve(N);
  const one = ones(N);
  const expectedEps = epsilon(N);

  const result = new Array<number>(N + 1).fill(0);

  rec
    .begin({ zh: `演示 μ * 1 = ε（N=${N}）`, en: `Demo μ * 1 = ε (N=${N})` })
    .setAux([
      { label: 'f = μ', value: mu.slice(1).join(', '), role: 'compare' },
      { label: 'g = 1', value: one.slice(1).join(', '), role: 'compare' },
    ])
    .commit();

  const hooks: DirichletHooks = {
    onAccumulate: (d, k, target) => {
      result[target]! += mu[d]! * one[k]!;
      const roles: BarRole[] = new Array(N + 1).fill('default');
      roles[target] = 'warn';
      rec
        .begin({
          zh: `d=${d}, k=${k} → result[${target}] += μ(${d})·1`,
          en: `d=${d}, k=${k} → result[${target}] += μ(${d})·1`,
        })
        .setArray(result, roles, [{ index: target, label: 't' }])
        .commit();
    },
  };

  dirichletConvolution(mu, one, N, hooks);

  rec
    .begin({ zh: `结果 μ*1 = ε`, en: `Result μ*1 = ε` })
    .setAux([
      { label: '结果', value: result.slice(1).join(', '), role: 'final' },
      { label: 'ε 验证', value: expectedEps.slice(1).join(', '), role: 'sorted' },
    ])
    .commit();

  return rec.build();
}
