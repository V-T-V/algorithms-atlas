// 小批量 K-均值 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-kmeans-mini-batch',
  categoryId: 'ml',
  title: { zh: '小批量 K-均值（Mini-Batch K-Means）', en: 'Mini-Batch K-Means' },
  summary: {
    zh: '每轮抽小批量样本做分配并按学习率 η=1/n_k 增量更新质心，比标准 K-Means 更快。',
    en: 'Sample a mini-batch each step, assign, and incrementally update centroids with η=1/n_k; faster than K-Means.',
  },
  description: {
    zh:
      '小批量 K-均值（Mini-Batch K-Means）：标准 K-Means 的可扩展版本。' +
      '\n- 每轮从数据集中随机抽 b 个样本（小批量）' +
      '\n- 把每个样本分配到最近质心' +
      '\n- 对该样本与其质心，按学习率 η = 1 / n_k（k 簇已见样本数）做增量更新：' +
      '  c_k ← c_k + η·(x − c_k)' +
      '\n- 随 n_k 增大学习率递减，质心逐步稳定' +
      '\n- 优点：单轮 O(b·K) 而非 O(N·K)，适合大数据/在线学习；结果略逊但接近标准 K-Means' +
      '\n- 收敛判据：连续若干轮质心位移很小，或达到最大迭代数' +
      '\n- 时间 `O(T·b·K)`（T 轮 × b 批 × K 簇），空间 `O(K)`。',
    en:
      'Mini-Batch K-Means: a scalable variant of K-Means. ' +
      '\n- Each step samples b points (mini-batch) from the dataset ' +
      '\n- Each sample is assigned to its nearest centroid ' +
      '\n- Centroids are updated incrementally with learning rate η = 1/n_k: ' +
      '  c_k ← c_k + η·(x − c_k) ' +
      '\n- η shrinks as n_k grows, stabilizing centroids ' +
      '\n- Pros: each step is O(b·K) instead of O(N·K), suited for large/online data; quality slightly below but close to K-Means ' +
      '\n- Convergence: small centroid movement over several steps, or max iterations reached ' +
      '\nTime O(T·b·K), space O(K).',
  },
  tags: ['ml', 'clustering', 'kmeans', 'mini-batch', 'online'],
  complexity: { time: 'O(T·b·K)', space: 'O(K)' },
};
