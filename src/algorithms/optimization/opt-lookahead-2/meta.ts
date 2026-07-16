// Lookahead · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-lookahead-2',
  categoryId: 'optimization',
  title: { zh: 'Lookahead', en: 'Lookahead Optimizer' },
  summary: {
    zh: 'Lookahead：内层任意优化器先走 k 步「快」权重，再向起点缓慢回退 α。',
    en: 'Lookahead: inner optimizer takes k "fast" steps, then slowly falls back α toward the start.',
  },
  description: {
    zh: 'Lookahead（Zhang 2019）：维护「慢权重」θ 与「快权重」φ。每 k 步内层更新 φ 后，θ ← θ + α(φ − θ)，再 φ ← θ。提升泛化、降低调参敏感度。',
    en: 'Lookahead (Zhang 2019): maintains "slow" weights θ and "fast" weights φ. After k inner steps, θ ← θ + α(φ − θ), then φ ← θ. Improves generalization and reduces tuning sensitivity.',
  },
  tags: ['optimization', 'wrapper'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
