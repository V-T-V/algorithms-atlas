// 重要性采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-importance',
  categoryId: 'randomized',
  title: { zh: '重要性采样', en: 'Importance Sampling' },
  summary: {
    zh: '从更频繁命中"重要"区域的提议分布采样，再用权重 p/q 修正，降低估计方差。',
    en: 'Sample from a proposal that hits the "important" region more often, then correct with weight p/q to reduce variance.',
  },
  description: {
    zh: '重要性采样估计 E_p[f] = E_q[f·p/q]。从易采样的 q 中采 N 个样本 x_i，计算 f(x_i)·p(x_i)/q(x_i) 的平均。当 q 在 f 较大处更密集时方差更小。常用于稀有事件估计、贝叶斯计算。',
    en: 'Importance sampling estimates E_p[f] = E_q[f·p/q]. Draw N samples x_i from easy q, average f(x_i)·p(x_i)/q(x_i). Variance shrinks when q is denser where f is large. Used for rare-event estimation and Bayesian computation.',
  },
  tags: ['randomized', 'monte-carlo', 'variance-reduction', 'importance'],
  complexity: { time: 'O(N)', space: 'O(N)' },
};
