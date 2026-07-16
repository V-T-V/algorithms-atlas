// 高斯-牛顿法 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-gauss-newton',
  categoryId: 'optimization',
  title: { zh: '高斯-牛顿法（最小二乘）', en: 'Gauss-Newton (Least Squares)' },
  summary: {
    zh: '最小二乘专用：用 JᵀJ 代替海森，省去二阶导，超线性收敛。',
    en: 'Least-squares-specific: replace Hessian with JᵀJ, skipping second derivatives, superlinear convergence.',
  },
  description: {
    zh: '高斯-牛顿法是牛顿法在最小二乘问题 min Σ r_i(x)² 上的专门版本。残差向量 r(x)，雅可比 J，目标 f=½||r||²。梯度 ∇f=Jᵀr，海森 ∇²f=JᵀJ + Σr_i∇²r_i。高斯-牛顿忽略二阶项，用 JᵀJ 近似海森，解 (JᵀJ)·Δx = −Jᵀr 得到搜索方向。优点：无需计算二阶导；缺点：当残差较大时 JᵀJ 近似偏差，且 JᵀJ 可能奇异（实际中常加阻尼，即 Levenberg-Marquardt）。本实现用高斯消元解正规方程，演示对一组数据点做曲线拟合。',
    en: 'Gauss-Newton is Newton method specialized for least squares min Σ r_i(x)². With residual vector r(x), Jacobian J, objective f=½||r||², gradient ∇f=Jᵀr, Hessian ∇²f=JᵀJ + Σr_i∇²r_i. Gauss-Newton drops the second-order term and approximates the Hessian by JᵀJ, solving (JᵀJ)·Δx = −Jᵀr for the step. Pros: no second derivatives; cons: poor approximation for large residuals and JᵀJ may be singular (in practice damped → Levenberg-Marquardt). This implementation solves the normal equations by Gaussian elimination, fitting a curve to data points.',
  },
  tags: ['optimization', 'least-squares', 'gauss-newton', 'nonlinear'],
  complexity: { time: 'O(k·n³)', space: 'O(n²)' },
};
