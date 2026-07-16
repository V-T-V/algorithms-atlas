// QR 迭代求特征值 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { eigenvaluesQR } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 2×2 实对称矩阵，特征值 5 与 2
  const A = [
    [4, 1],
    [1, 3],
  ];

  rec
    .begin({ zh: `输入 2×2 矩阵`, en: `Input 2×2 matrix` })
    .setGrid([
      [
        { v: '4', role: 'default' },
        { v: '1', role: 'default' },
      ],
      [
        { v: '1', role: 'default' },
        { v: '3', role: 'default' },
      ],
    ])
    .commit();

  const eigs = eigenvaluesQR(A, 50, 1e-10, {
    onIter: (iter, ak) => {
      rec
        .begin({ zh: `第 ${iter} 次迭代`, en: `Iteration ${iter}` })
        .setGrid(ak.map((row) => row.map((v) => ({ v: v.toFixed(4), role: 'compare' as const }))))
        .commit();
    },
  });

  const sorted = [...eigs].sort((a, b) => b - a);
  rec
    .begin({
      zh: `收敛，特征值 ${sorted.map((e) => e.toFixed(4)).join(', ')}`,
      en: `Converged: λ = ${sorted.map((e) => e.toFixed(4)).join(', ')}`,
    })
    .setAux([{ label: `特征值`, value: sorted.map((e) => e.toFixed(6)).join(', ') }])
    .commit();

  return rec.build();
}
