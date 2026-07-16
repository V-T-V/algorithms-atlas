// 奇异值分解 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import { svd, reconstruct } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  // 3×2 矩阵
  const A = [
    [3, 0],
    [0, 4],
    [0, 0],
  ];

  rec
    .begin({ zh: `输入 3×2 矩阵`, en: `Input 3×2 matrix` })
    .setGrid(A.map((row) => row.map((v) => ({ v: String(v), role: 'default' as const }))))
    .commit();

  let rotations = 0;
  const result = svd(A, 60, 1e-12, {
    onRotation: () => rotations++,
  });

  rec
    .begin({ zh: `${rotations} 次旋转后收敛`, en: `Converged after ${rotations} rotations` })
    .setBars(rec.barsFrom(result.singularValues.slice()))
    .setAux([{ label: `奇异值`, value: result.singularValues.map((s) => s.toFixed(4)).join(', ') }])
    .commit();

  const recon = reconstruct(result);
  rec
    .begin({ zh: `重构矩阵（应接近原矩阵）`, en: `Reconstructed matrix (should match original)` })
    .setGrid(recon.map((row) => row.map((v) => ({ v: v.toFixed(4), role: 'final' as const }))))
    .commit();

  return rec.build();
}
