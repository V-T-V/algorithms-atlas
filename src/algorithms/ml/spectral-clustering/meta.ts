// 谱聚类 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ml-spectral-clustering',
  categoryId: 'ml',
  title: { zh: '谱聚类（归一化拉普拉斯）', en: 'Spectral Clustering (Normalized Laplacian)' },
  summary: {
    zh: '用相似度图归一化拉普拉斯的前 k 个特征向量降维，再 K-均值聚类。',
    en: 'Use the top-k eigenvectors of the normalized graph Laplacian to embed points, then run K-Means.',
  },
  description: {
    zh:
      '谱聚类（Spectral Clustering）：基于图拉普拉斯的特征分解，能识别非凸形状的簇。' +
      '\n步骤：' +
      '\n1. 构造相似度矩阵 W（用高斯核 exp(−||xi−xj||²/(2σ²)) 或 ε 邻域）' +
      '\n2. 度矩阵 D = diag(Σj Wi,j)' +
      '\n3. 归一化拉普拉斯 L_sym = I − D^(−1/2)·W·D^(−1/2)' +
      '\n4. 求 L_sym 最小的 k 个特征值对应的特征向量，拼成 n×k 矩阵 U' +
      '\n5. 对 U 的每行做 L2 归一化' +
      '\n6. 在 U 的行向量上跑 K-均值，得到聚类标签' +
      '\n- 优点：能分同心圆、月牙等非凸结构（K-均值做不到）' +
      '\n- 本实现：用幂迭代/雅可比求特征向量，便于教学' +
      '\n- 时间 `O(n³)`（特征分解主导），空间 `O(n²)`。',
    en:
      'Spectral Clustering: based on eigendecomposition of the graph Laplacian; captures non-convex clusters. ' +
      '\nSteps: ' +
      '\n1. Build similarity matrix W (Gaussian kernel or ε-neighborhood) ' +
      '\n2. Degree matrix D = diag(Σj Wi,j) ' +
      '\n3. Normalized Laplacian L_sym = I − D^(−1/2)·W·D^(−1/2) ' +
      '\n4. Take eigenvectors of the k smallest eigenvalues of L_sym → n×k matrix U ' +
      '\n5. L2-normalize each row of U ' +
      '\n6. Run K-Means on the rows of U to get labels ' +
      '\n- Advantage: separates concentric circles, moons, etc. (impossible for K-Means) ' +
      '\nTime O(n³) (eigendecomposition dominates), space O(n²).',
  },
  tags: ['ml', 'clustering', 'spectral', 'graph-laplacian', 'eigendecomposition'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
