// 回溯线搜索 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-line-search-backtrack',
  categoryId: 'optimization',
  title: { zh: '回溯线搜索（Armijo）', en: 'Backtracking Line Search (Armijo)' },
  summary: {
    zh: '从大步长起反复回缩，直到满足 Armijo 充分下降条件。',
    en: 'Start from a large step and shrink until the Armijo sufficient-decrease condition holds.',
  },
  description: {
    zh: '回溯线搜索是最简单的「充分下降」步长策略：给定下降方向 p（pᵀg<0），初始步长 α₀（常取 1），缩放因子 ρ∈(0,1)（如 0.5），参数 c∈(0,1)（如 1e-4）。若 f(x+αp) ≤ f(x) + c·α·gᵀp（Armijo 条件）则接受 α；否则 α ← ρα 重复。它保证每步有「足够」下降，是 BFGS/L-BFGS 等拟牛顿法的默认线搜索。不要求曲率条件（Wolfe），故可能步长偏小、收敛稍慢，但实现极简、稳健。',
    en: 'Backtracking line search is the simplest sufficient-decrease step strategy: given a descent direction p (pᵀg<0), initial step α₀ (usually 1), shrink factor ρ∈(0,1) (e.g. 0.5), and parameter c∈(0,1) (e.g. 1e-4). Accept α when f(x+αp) ≤ f(x) + c·α·gᵀp (Armijo); otherwise α ← ρα and repeat. It guarantees enough decrease per step and is the default line search for BFGS/L-BFGS. It does not enforce curvature (Wolfe), so steps may be small and convergence slightly slower, but the implementation is minimal and robust.',
  },
  tags: ['optimization', 'line-search', 'armijo', 'first-order'],
  complexity: { time: 'O(k·c(x))', space: 'O(1)' },
};
