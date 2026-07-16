// Mean-Shift 均值漂移聚类 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mean-shift',
  categoryId: 'ml',
  title: { zh: '均值漂移聚类', en: 'Mean-Shift Clustering' },
  summary: {
    zh: '沿核密度梯度把每个点滑向最近的密度极大值，自动确定簇数，无需预先指定 K。',
    en: 'Slides each point up the kernel-density gradient toward the nearest mode; infers the number of clusters automatically.',
  },
  description: {
    zh: 'Mean-Shift 是一种基于核密度估计的**非参数**聚类算法。\n\n每个数据点向其带宽 `h` 邻域内点的**均值方向**移动一步，反复迭代直至收敛到密度的局部极大值（mode）。\n\n核函数常用高斯核 `K(d) = exp(-d²/(2h²))`，距离越近权重越大。\n\n特点：\n- 不需指定簇数 K；\n- 簇数由带宽 `h` 隐式决定；\n- 任意形状的簇都能捕捉。',
    en: 'Mean-Shift is a **non-parametric** clustering algorithm based on kernel-density estimation.\n\nEach point moves a step toward the **mean** of points within its bandwidth `h`, iterating until it converges to a local maximum (mode) of the density.\n\nA Gaussian kernel `K(d) = exp(-d²/(2h²))` weights nearer points higher.\n\nProperties:\n- No need to specify K;\n- the number of clusters is implicitly set by the bandwidth `h`;\n- handles arbitrary cluster shapes.',
  },
  tags: ['ml', 'clustering', 'density-based', 'non-parametric'],
  complexity: { time: 'O(n²·T)', space: 'O(n)' },
};
