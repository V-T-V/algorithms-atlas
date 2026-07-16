// 卡尔曼滤波 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kalman-filter',
  categoryId: 'optimization',
  title: { zh: '卡尔曼滤波', en: 'Kalman Filter' },
  summary: {
    zh: '对线性高斯状态空间模型递归地融合预测与含噪观测，给出最小均方误差的状态估计。',
    en: 'Recursively fuses prediction with noisy observations in a linear-Gaussian state-space to give the MMSE state estimate.',
  },
  description: {
    zh: '卡尔曼滤波是最优的**线性**递归估计器。模型：\n\n- 状态转移 `x_k = F·x_{k−1} + B·u_k + w_k`（`w ~ N(0,Q)`）\n- 观测 `z_k = H·x_k + v_k`（`v ~ N(0,R)`）\n\n两阶段循环：\n1. **预测**：`x̂⁻ = F·x̂`, `P⁻ = F·P·Fᵀ + Q`\n2. **更新**：卡尔曼增益 `K = P⁻Hᵀ(HP⁻Hᵀ + R)⁻¹`，\n   `x̂ = x̂⁻ + K(z − Hx̂⁻)`，`P = (I − KH)P⁻`\n\n特性：无偏、最小均方误差；广泛应用于导航、跟踪、传感器融合。',
    en: 'The Kalman filter is the optimal **linear** recursive estimator. Model:\n\n- transition `x_k = F·x_{k−1} + B·u_k + w_k` (`w ~ N(0,Q)`)\n- observation `z_k = H·x_k + v_k` (`v ~ N(0,R)`)\n\nTwo-phase loop:\n1. **Predict**: `x̂⁻ = F·x̂`, `P⁻ = F·P·Fᵀ + Q`\n2. **Update**: gain `K = P⁻Hᵀ(HP⁻Hᵀ + R)⁻¹`,\n   `x̂ = x̂⁻ + K(z − Hx̂⁻)`, `P = (I − KH)P⁻`\n\nProperties: unbiased, MMSE; widely used in navigation, tracking, sensor fusion.',
  },
  tags: ['optimization', 'filtering', 'estimation', 'recursive', 'linear'],
  complexity: { time: 'O(T·d³)', space: 'O(d²)' },
};
