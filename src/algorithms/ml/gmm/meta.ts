// 高斯混合模型（EM 算法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gmm',
  categoryId: 'ml',
  title: { zh: '高斯混合模型（EM）', en: 'Gaussian Mixture Model (EM)' },
  summary: {
    zh: '用期望最大化（EM）将数据拟合为若干高斯分量的加权和，给出软分配概率。',
    en: 'Fits data as a weighted sum of Gaussian components via Expectation-Maximization, yielding soft cluster probabilities.',
  },
  description: {
    zh: '高斯混合模型（GMM）假设数据由 K 个高斯分布混合生成，用 **EM 算法**求最大似然参数：\n\n1. **E 步**：对每个点 i 与每个分量 k，计算归属概率\n   `γ_ik = π_k·N(x_i|μ_k,Σ_k) / Σ_j π_j·N(x_j|μ_j,Σ_j)`\n2. **M 步**：用 γ_ik 作软权重更新 `π_k, μ_k, Σ_k`：\n   - `N_k = Σ_i γ_ik`\n   - `π_k = N_k/n`，`μ_k = (1/N_k)·Σ_i γ_ik·x_i`\n\n迭代直至对数似然收敛。与 K-Means 相比，GMM 给出软分配且能建模椭圆形簇。',
    en: 'A Gaussian Mixture Model (GMM) assumes data is generated from K Gaussian components and uses **EM** to find maximum-likelihood parameters:\n\n1. **E-step**: compute responsibilities\n   `γ_ik = π_k·N(x_i|μ_k,Σ_k) / Σ_j π_j·N(x_j|μ_j,Σ_j)`\n2. **M-step**: update `π_k, μ_k, Σ_k` using γ_ik as soft weights:\n   - `N_k = Σ_i γ_ik`\n   - `π_k = N_k/n`, `μ_k = (1/N_k)·Σ_i γ_ik·x_i`\n\nIterate until log-likelihood converges. Compared with K-Means, GMM yields soft assignments and elliptical clusters.',
  },
  tags: ['ml', 'clustering', 'probabilistic', 'em', 'gaussian'],
  complexity: { time: 'O(n·k·d²·T)', space: 'O(n·k)' },
};
