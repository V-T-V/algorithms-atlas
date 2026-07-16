// 扩展卡尔曼滤波 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'extended-kalman',
  categoryId: 'optimization',
  title: { zh: '扩展卡尔曼滤波', en: 'Extended Kalman Filter' },
  summary: {
    zh: '用一阶泰勒展开（雅可比）线性化非线性状态/观测方程，把卡尔曼滤波推广到非线性系统。',
    en: 'Linearizes nonlinear transition/observation via first-order Taylor (Jacobians), extending the Kalman filter to nonlinear systems.',
  },
  description: {
    zh: '扩展卡尔曼滤波（EKF）处理**非线性**模型：\n\n- 状态 `x_k = f(x_{k−1}) + w_k`\n- 观测 `z_k = h(x_k) + v_k`\n\n用雅可比线性化：\n- `F = ∂f/∂x` 在 `x̂_{k−1}` 处\n- `H = ∂h/∂x` 在 `x̂⁻` 处\n\n预测：`x̂⁻ = f(x̂)`，`P⁻ = FPFᵀ + Q`\n更新：与线性 KF 相同，`K = P⁻Hᵀ(HP⁻Hᵀ + R)⁻¹`，`x̂ = x̂⁻ + K(z − h(x̂⁻))`。\n\n缺点：强非线性时线性化误差大（需 UKF 或粒子滤波）；优点：实现相对简单、实时。',
    en: 'The Extended Kalman Filter (EKF) handles **nonlinear** models:\n\n- state `x_k = f(x_{k−1}) + w_k`\n- observation `z_k = h(x_k) + v_k`\n\nLinearization via Jacobians:\n- `F = ∂f/∂x` evaluated at `x̂_{k−1}`\n- `H = ∂h/∂x` evaluated at `x̂⁻`\n\nPredict: `x̂⁻ = f(x̂)`, `P⁻ = FPFᵀ + Q`\nUpdate: same as linear KF, `K = P⁻Hᵀ(HP⁻Hᵀ + R)⁻¹`, `x̂ = x̂⁻ + K(z − h(x̂⁻))`.\n\nDrawback: linearization error under strong nonlinearity (use UKF/particle filter then); advantage: relatively simple and real-time.',
  },
  tags: ['optimization', 'filtering', 'estimation', 'nonlinear'],
  complexity: { time: 'O(T·d³)', space: 'O(d²)' },
};
