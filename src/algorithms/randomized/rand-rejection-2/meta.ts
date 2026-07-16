// 拒绝采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-rejection-2',
  categoryId: 'randomized',
  title: { zh: '拒绝采样', en: 'Rejection Sampling' },
  summary: {
    zh: '用易采样的提议分布 + 包络常数生成目标分布样本：落在外包络内接受、否则拒绝。',
    en: 'Use an easy proposal distribution plus an envelope constant to generate target-distribution samples: accept inside the envelope, reject otherwise.',
  },
  description: {
    zh: '拒绝采样 (von Neumann)：选一个容易采样的提议分布 q(x) 和常数 M，使 M·q(x) ≥ p(x) 对所有 x 成立。每次：从 q 采 x，以概率 p(x)/(M·q(x)) 接受；否则重复。接受率 = 1/M。本实现用单位正方形内采单位圆作为示例。',
    en: 'Rejection sampling (von Neumann): pick an easy proposal q(x) and constant M with M·q(x) ≥ p(x) everywhere. Each step: draw x from q, accept with probability p(x)/(M·q(x)); otherwise retry. Acceptance rate is 1/M. We use sampling the unit disk within the unit square as the example.',
  },
  tags: ['randomized', 'sampling', 'rejection', 'monte-carlo'],
  complexity: { time: 'O(1/M) 期望', space: 'O(1)' },
};
