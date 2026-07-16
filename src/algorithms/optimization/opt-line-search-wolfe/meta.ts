// Wolfe 条件线搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-line-search-wolfe',
  categoryId: 'optimization',
  title: { zh: 'Wolfe 条件线搜索', en: 'Wolfe Conditions Line Search' },
  summary: {
    zh: '要求 Armijo 充分下降 + 曲率条件，保证步长既下降又远离零。',
    en: 'Require Armijo sufficient decrease plus a curvature condition, ensuring a decreasing step bounded away from zero.',
  },
  description: {
    zh: 'Wolfe 条件由两条组成：(1) 充分下降（Armijo）f(x+αp) ≤ f(x) + c₁·α·gᵀp；(2) 曲率条件 |g(x+αp)ᵀp| ≤ c₂·|gᵀp|，c₂>c₁。曲率条件保证新点处方向导数「更平」，即 α 不至于太小。强 Wolfe 进一步要求曲率用绝对值（避免方向导数变正）。满足 Wolfe 的步长使大多数拟牛顿法（BFGS 等）保持海森逆近似正定，是这些方法的理论基石。本实现用「分治」区间收缩法（bracketing + zoom）求满足强 Wolfe 的步长。',
    en: 'The Wolfe conditions are two-fold: (1) sufficient decrease (Armijo) f(x+αp) ≤ f(x) + c₁·α·gᵀp; (2) curvature |g(x+αp)ᵀp| ≤ c₂·|gᵀp| with c₂>c₁. The curvature condition guarantees the new directional derivative is "flatter" so α is not too small. Strong Wolfe replaces the curvature with an absolute value. Steps satisfying Wolfe keep the inverse-Hessian approximation positive-definite for most quasi-Newton methods (BFGS), and is their theoretical bedrock. This implementation uses bracketing + zoom bisection to find a strong-Wolfe step.',
  },
  tags: ['optimization', 'line-search', 'wolfe', 'first-order'],
  complexity: { time: 'O(k·c(x))', space: 'O(1)' },
};
