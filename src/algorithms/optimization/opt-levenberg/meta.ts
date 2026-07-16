// Levenberg-Marquardt · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-levenberg',
  categoryId: 'optimization',
  title: { zh: 'Levenberg-Marquardt', en: 'Levenberg-Marquardt' },
  summary: {
    zh: '高斯-牛顿 + 阻尼：用 λ 在最速下降与高斯-牛顿间自适应插值。',
    en: 'Gauss-Newton with damping: λ adaptively interpolates between steepest descent and Gauss-Newton.',
  },
  description: {
    zh: 'Levenberg-Marquardt（LM）是非线性最小二乘的事实标准算法，巧妙地在两种策略间插值：当离解远时退化为最速下降（稳健但慢），靠近解时逼近高斯-牛顿（快但需精确初值）。其核心是给正规方程加阻尼：(JᵀJ + λ·diag(JᵀJ))·Δx = −Jᵀr。若新步降低成本则接受并减小 λ（更接近高斯-牛顿），否则拒绝并增大 λ（更接近最速下降）。本实现复用高斯-牛顿的雅可比与求解器，演示自适应阻尼。',
    en: 'Levenberg-Marquardt (LM) is the de-facto standard for nonlinear least squares, cleverly interpolating between two strategies: far from the solution it reduces to steepest descent (robust but slow); near the solution it approaches Gauss-Newton (fast but needs good initialization). The core damps the normal equations: (JᵀJ + λ·diag(JᵀJ))·Δx = −Jᵀr. If the step reduces cost it is accepted and λ is decreased (closer to Gauss-Newton), otherwise rejected and λ increased (closer to steepest descent). This implementation reuses the Gauss-Newton Jacobian and solver and demonstrates adaptive damping.',
  },
  tags: ['optimization', 'least-squares', 'levenberg-marquardt', 'nonlinear'],
  complexity: { time: 'O(k·n³)', space: 'O(n²)' },
};
