// 时序差分 TD(λ) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-temporal-difference',
  categoryId: 'ai-search',
  title: { zh: 'TD(λ) 前向视图', en: 'TD(λ) Forward View' },
  summary: {
    zh: '将单步 TD 与蒙特卡洛在 λ 几何加权下统一，对状态价值做 λ-回报估计。',
    en: 'Unify one-step TD with Monte Carlo via λ-geometric weighting, estimating state values with the λ-return.',
  },
  description: {
    zh: 'λ-回报：G_t^λ = (1−λ)·Σ_{n≥1} λ^{n−1}·G_t^{(n)}，其中 G_t^{(n)} 为 n 步回报。更新 V(s_t) ← V(s_t) + α·[G_t^λ − V(s_t)]。λ=0 退化为 TD(0)，λ=1 退化为蒙特卡洛。本实现用前向视图对完整回合离线计算 G^λ 后更新。',
    en: 'λ-return: G_t^λ = (1−λ)·Σ_{n≥1} λ^{n−1}·G_t^{(n)} where G_t^{(n)} is the n-step return. Update V(s_t) ← V(s_t) + α·[G_t^λ − V(s_t)]. λ=0 reduces to TD(0), λ=1 to Monte Carlo. This implementation uses the forward view, computing G^λ offline per episode.',
  },
  tags: ['ai-search', 'reinforcement-learning', 'td-lambda', 'eligibility', 'return-based'],
  complexity: { time: 'O(T²·E)', space: 'O(T)' },
};
