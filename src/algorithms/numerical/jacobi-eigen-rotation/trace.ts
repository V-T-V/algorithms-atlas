// Jacobi 旋转求特征值 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { jacobiEigen } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 2×2 对称矩阵
  const A = [
    [4, 1],
    [1, 3],
  ];

  rec
    .begin({ zh: `输入 2×2 对称矩阵`, en: `Input 2×2 symmetric matrix` })
    .setGrid([
      [
        { v: '4', role: 'default' },
        { v: '1', role: 'compare' },
      ],
      [
        { v: '1', role: 'compare' },
        { v: '3', role: 'default' },
      ],
    ])
    .commit();

  const res = jacobiEigen(A, 50, 1e-10, {
    onRotation: (iter, p, q, diag) => {
      rec
        .begin({
          zh: `第 ${iter} 次旋转消去 (${p},${q})`,
          en: `Rotation ${iter} zeroing (${p},${q})`,
        })
        .setAux([{ label: `当前对角`, value: diag.map((d) => d.toFixed(4)).join(', ') }])
        .commit();
    },
  });

  const sorted = [...res.eigenvalues].sort((a, b) => b - a);
  rec
    .begin({
      zh: `收敛，特征值 ${sorted.map((e) => e.toFixed(4)).join(', ')}`,
      en: `Converged: λ = ${sorted.map((e) => e.toFixed(4)).join(', ')}`,
    })
    .setAux([{ label: `特征值`, value: sorted.map((e) => e.toFixed(6)).join(', ') }])
    .commit();

  return rec.build();
}
