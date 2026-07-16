// =============================================================================
// 带位移的幂法 · 录制帧序列
// 求对称矩阵 [[2,1],[1,2]] 的特征值（精确 1, 3），用 σ=0 找最大。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { powerMethodShift, type PowerShiftHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  A: [
    [2, 1],
    [1, 2],
  ],
  shift: 0,
};

export function buildTrace(input: { A: number[][]; shift: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { A, shift } = input;

  rec
    .begin({
      zh: `用位移 σ=${shift} 的幂法求最大特征值`,
      en: `Power method with shift σ=${shift} for dominant eigenvalue`,
    })
    .setAux([{ label: '说明', value: 'v ← (A-σI)v 归一化', role: 'pivot' as BarRole }])
    .commit();

  const hooks: PowerShiftHooks = {
    onIter: (iter, v, mu, lambda) => {
      rec
        .begin({
          zh: `迭代 ${iter}：λ ≈ ${lambda.toFixed(6)}`,
          en: `Iter ${iter}: λ ≈ ${lambda.toFixed(6)}`,
        })
        .setBars(
          v.map((x, i) => ({
            value: x,
            role: i === 0 ? ('frontier' as BarRole) : ('compare' as BarRole),
            label: `v${i}=${x.toFixed(3)}`,
          })),
        )
        .setAux([
          { label: '迭代', value: String(iter), role: 'pivot' as BarRole },
          { label: 'μ(A-σI)', value: mu.toFixed(6), role: 'compare' as BarRole },
          { label: 'λ(A) = σ+μ', value: lambda.toFixed(6), role: 'final' as BarRole },
        ])
        .commit();
    },
  };

  const result = powerMethodShift(A, shift, 100, 1e-10, hooks);

  rec
    .begin({
      zh: `完成：λ ≈ ${result.eigenvalue.toFixed(6)}`,
      en: `Done: λ ≈ ${result.eigenvalue.toFixed(6)}`,
    })
    .setBars(
      result.eigenvector.map((x, i) => ({
        value: x,
        role: 'final' as BarRole,
        label: `v${i}=${x.toFixed(3)}`,
      })),
    )
    .setMap([
      { key: '特征值 λ', value: result.eigenvalue.toFixed(6), role: 'final' as BarRole },
      {
        key: '特征向量',
        value: result.eigenvector.map((v) => v.toFixed(4)).join(', '),
        role: 'final' as BarRole,
      },
      { key: '迭代次数', value: String(result.iterations), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
