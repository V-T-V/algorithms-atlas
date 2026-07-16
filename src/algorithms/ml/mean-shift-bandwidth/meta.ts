// Mean-Shift（带带宽核）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-mean-shift-bandwidth',
  categoryId: 'ml',
  title: { zh: 'Mean-Shift（带带宽核）', en: 'Mean-Shift with Bandwidth Kernel' },
  summary: {
    zh: '对每点反复把窗口中心移到窗口内点的核加权均值，收敛到密度峰值得簇。',
    en: 'Repeatedly shift each window center to the kernel-weighted mean of points inside it, converging to density modes.',
  },
  description: {
    zh:
      'Mean-Shift（均值漂移）：基于核密度估计的非参数聚类，能自动发现簇数。' +
      '\n对每个起始点 x：' +
      '\n1. 在 x 处放一个半径 = 带宽 h 的窗口' +
      '\n2. 计算窗口内所有点的高斯核加权均值（重心）：' +
      '   m(x) = Σ x_i · K(||x_i−x||/h) / Σ K(||x_i−x||/h)' +
      '   K 为高斯核 K(d) = exp(−d²/2)' +
      '\n3. 把中心移到 m(x)：x ← m(x)' +
      '\n4. 重复直到位移小于阈值（收敛到密度局部极大值 = 模式点）' +
      '\n收敛到同一模式点的起始点归为同一簇。' +
      '\n- 带宽 h 决定窗口大小：h 大 → 簇少，h 小 → 簇多' +
      '\n- 与现有 mean-shift 区别：本实现聚焦「显式带宽 + 高斯核」教学版，并暴露核重心计算' +
      '\n- 时间 `O(T·n²)`（T 次迭代），空间 `O(n)`。',
    en:
      'Mean-Shift: non-parametric clustering via kernel density estimation; cluster count is automatic. ' +
      '\nFor each starting point x: ' +
      '\n1. Place a window of radius = bandwidth h at x ' +
      '\n2. Compute the Gaussian-kernel-weighted mean of points within: ' +
      '   m(x) = Σ x_i · K(||x_i−x||/h) / Σ K(||x_i−x||/h), K(d) = exp(−d²/2) ' +
      '\n3. Move the center to m(x): x ← m(x) ' +
      '\n4. Repeat until the shift is below threshold (converges to a local density maximum, a "mode") ' +
      '\nStarting points converging to the same mode form one cluster. ' +
      '\n- Bandwidth h controls window size: large h → few clusters, small h → many clusters ' +
      '\n- Differs from existing mean-shift: this is a teaching version focused on explicit bandwidth + Gaussian kernel and exposes the mean computation ' +
      '\nTime O(T·n²) (T iterations), space O(n).',
  },
  tags: ['ml', 'clustering', 'density', 'mean-shift', 'kernel'],
  complexity: { time: 'O(T·n²)', space: 'O(n)' },
};
