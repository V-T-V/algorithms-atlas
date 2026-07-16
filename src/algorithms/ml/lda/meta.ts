// 线性判别分析（LDA）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lda',
  categoryId: 'ml',
  title: { zh: '线性判别分析（LDA）', en: 'Linear Discriminant Analysis' },
  summary: {
    zh: '投影方向使类间方差最大、类内方差最小，既是降维也是线性分类器。',
    en: 'Finds a projection that maximizes between-class variance over within-class variance — both a dimensionality reducer and a linear classifier.',
  },
  description: {
    zh: '线性判别分析（LDA）寻找一个投影方向 `w`，使\n\n  `J(w) = wᵀS_B w / wᵀS_W w`\n\n最大化，其中 `S_B` 为类间散度矩阵，`S_W` 为类内散度矩阵。最优 `w` 是 `S_W⁻¹S_B` 的最大特征向量（二类情形下显式解）。\n\n投影后类内紧凑、类间分离，可用于：\n- **降维**：投影到 K−1 维子空间；\n- **分类**：比较到各类均值的马氏距离。',
    en: 'Linear Discriminant Analysis (LDA) finds a projection `w` that maximizes\n\n  `J(w) = wᵀS_B w / wᵀS_W w`\n\nwhere `S_B` is the between-class scatter and `S_W` the within-class scatter. The optimum `w` is the leading eigenvector of `S_W⁻¹S_B` (closed form for two classes).\n\nAfter projection, classes are tight within and separated between, useful for:\n- **Dimensionality reduction**: project to K−1 dimensions;\n- **Classification**: compare Mahalanobis distance to class means.',
  },
  tags: ['ml', 'classification', 'dimensionality-reduction', 'linear-model'],
  complexity: { time: 'O(d³ + nd²)', space: 'O(d²)' },
};
