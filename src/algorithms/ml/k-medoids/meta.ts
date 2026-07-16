// K-Medoids 聚类（PAM）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'k-medoids',
  categoryId: 'ml',
  title: { zh: 'K-中心点聚类（PAM）', en: 'K-Medoids Clustering (PAM)' },
  summary: {
    zh: '以实际数据点作为簇代表（medoid），最小化簇内到代表点的总距离，对离群点比 K-均值更稳健。',
    en: 'Picks actual data points as cluster representatives (medoids), minimizing total dissimilarity; more robust to outliers than K-Means.',
  },
  description: {
    zh: 'K-Medoids（Partitioning Around Medoids，PAM）以**真实数据点**而非虚拟质心作为簇的代表。\n\n每轮分两步：\n1. **分配**：每个点归到最近的 medoid；\n2. **交换**：对每对 (medoid m, 非 medoid o)，尝试用 o 替换 m，若总代价下降则采纳。\n\n代价 = Σ 每点到其最近 medoid 的距离。当无交换能降低代价时收敛。',
    en: 'K-Medoids (Partitioning Around Medoids, PAM) uses **actual data points** as cluster representatives instead of mean centroids.\n\nEach round has two phases:\n1. **Assignment**: each point joins its nearest medoid.\n2. **Swap**: for each pair (medoid m, non-medoid o), tentatively replace m with o; accept if total cost decreases.\n\nCost = Σ distance of each point to its nearest medoid. It converges when no swap reduces cost.',
  },
  tags: ['ml', 'clustering', 'partitioning', 'distance-based'],
  complexity: { time: 'O(k(n-k)²·I)', space: 'O(n)' },
};
