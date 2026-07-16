// t-SNE 降维（简化版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 't-sne',
  categoryId: 'ml',
  title: { zh: 't-SNE 降维（简化版）', en: 't-SNE (Simplified)' },
  summary: {
    zh: '把高维点映射到 2D，用重尾 t 分布衡量低维相似度，使簇内紧凑、簇间分离，常用于可视化。',
    en: 'Embeds high-dimensional points into 2D using a heavy-tailed t-distribution for low-dim similarity, tightening clusters for visualization.',
  },
  description: {
    zh: 't-SNE（t-Distributed Stochastic Neighbor Embedding）是非线性降维算法，特别擅长可视化。\n\n核心思想：\n1. **高维**：用高斯核把点对距离转为相似概率 `pⱼᵢ ∝ exp(−‖xᵢ−xⱼ‖²/2σ²)`；\n2. **低维**：用自由度为 1 的 Student-t（重尾）`qⱼᵢ ∝ (1+‖yᵢ−yⱼ‖²)⁻¹`；\n3. **优化**：用梯度下降最小化 `KL(P‖Q)`，梯度为\n   `∂C/∂yᵢ = 4·Σⱼ (pᵢⱼ − qᵢⱼ)(yᵢ − yⱼ)`。\n\n本简化版：固定 σ，随机初始化 y，固定学习率与动量。\n\n重尾 t 分布缓解高维「拥挤问题」。',
    en: 't-SNE (t-Distributed Stochastic Embedding) is a nonlinear dimensionality-reduction method popular for visualization.\n\nKey ideas:\n1. **High-dim**: convert pairwise distances to probabilities via a Gaussian kernel `pⱼᵢ ∝ exp(−‖xᵢ−xⱼ‖²/2σ²)`;\n2. **Low-dim**: use a Student-t with 1 dof (heavy tail) `qⱼᵢ ∝ (1+‖yᵢ−yⱼ‖²)⁻¹`;\n3. **Optimize**: gradient descent on `KL(P‖Q)` with gradient\n   `∂C/∂yᵢ = 4·Σⱼ (pᵢⱼ − qᵢⱼ)(yᵢ − yⱼ)`.\n\nThis simplified version: fixed σ, random init y, fixed learning rate and momentum.\n\nThe heavy-tailed t-distribution alleviates the "crowding problem".',
  },
  tags: ['ml', 'dimensionality-reduction', 'nonlinear', 'visualization'],
  complexity: { time: 'O(n²·T)', space: 'O(n²)' },
};
