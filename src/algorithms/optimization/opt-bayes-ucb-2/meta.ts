// 贝叶斯优化 UCB · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-bayes-ucb-2',
  categoryId: 'optimization',
  title: { zh: '贝叶斯优化 UCB', en: 'Bayesian Optimization UCB' },
  summary: {
    zh: 'UCB 采集函数：选 μ(x) + κ·σ(x) 最大的点。',
    en: 'UCB acquisition: pick the point with max μ(x) + κ·σ(x).',
  },
  description: {
    zh: '贝叶斯优化采集函数 Upper Confidence Bound：在代理模型（高斯过程简化版）的预测均值 μ 与方差 σ² 上选下一个采样点。',
    en: 'Bayesian optimization acquisition Upper Confidence Bound: pick the next sample point from surrogate model (simplified GP) predictions μ and variance σ².',
  },
  tags: ['optimization', 'bayesian', 'black-box'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
