// 贝叶斯优化 PI · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-bayes-pi',
  categoryId: 'optimization',
  title: { zh: '贝叶斯优化 PI', en: 'Bayesian Optimization PI' },
  summary: {
    zh: 'PI 采集函数：最大化改进概率 P(f > f* + ξ)。',
    en: 'PI acquisition: maximize probability of improvement P(f > f* + ξ).',
  },
  description: {
    zh: '贝叶斯优化采集函数 Probability of Improvement：在代理模型（高斯过程简化版）的预测均值 μ 与方差 σ² 上选下一个采样点。',
    en: 'Bayesian optimization acquisition Probability of Improvement: pick the next sample point from surrogate model (simplified GP) predictions μ and variance σ².',
  },
  tags: ['optimization', 'bayesian', 'black-box'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
