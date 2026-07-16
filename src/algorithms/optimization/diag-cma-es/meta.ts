// 对角 CMA-ES · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'diag-cma-es',
  categoryId: 'optimization',
  title: { zh: '对角 CMA-ES', en: 'Diagonal CMA-ES' },
  summary: {
    zh: '只更新协方差矩阵对角线（每维独立步长与方差）的简化 CMA-ES，在高维上成本低、可作为完整版预热阶段。',
    en: 'A CMA-ES variant updating only the diagonal of the covariance — per-dimension step-size/variance, cheaper in high dimensions, often used as a warm-up phase.',
  },
  description: {
    zh: '完整 CMA-ES 学习完整的协方差矩阵 `C`（O(n²) 参数）。**对角 CMA-ES** 只学对角线（每维方差），参数量降为 O(n)，适合：\n- **高维**问题（完整 CMA 成本过高）；\n- 作为完整 CMA-ES 的**预热阶段**（先对角，再切到完整）。\n\n机制（同 CMA-ES 的选择-重组-自适应）：\n1. 从 `N(m, σ²·diag(c))` 采样 λ 个个体；\n2. 按目标值排序取前 μ 作加权重组，更新均值 `m`；\n3. 沿搜索路径自适应步长 `σ`（CSA，cumulative step-size adaptation）；\n4. 更新对角方差 `c`（基于 rank-μ + rank-one，但只取对角）。\n\n本简化版只做：均值重组 + CSA 步长控制 + 对角方差指数滑动。',
    en: 'Full CMA-ES learns the complete covariance matrix `C` (O(n²) params). **Diagonal CMA-ES** learns only the diagonal (per-dimension variances), reducing params to O(n), suited to:\n- **high-dimensional** problems (full CMA too costly);\n- a **warm-up phase** before switching to full CMA.\n\nMechanism (selection-recombination-adaptation like CMA-ES):\n1. sample λ individuals from `N(m, σ²·diag(c))`;\n2. sort and weighted-recombine the top μ to update the mean `m`;\n3. adapt the step-size `σ` via cumulative step-size adaptation (CSA);\n4. update diagonal variances `c` via rank-μ + rank-one but diagonal-only.\n\nThis simplified version does: mean recombination + CSA step control + exponential diagonal-variance smoothing.',
  },
  tags: ['optimization', 'evolution-strategy', 'adaptive', 'derivative-free'],
  complexity: { time: 'O(n·λ·G)', space: 'O(n)' },
};
