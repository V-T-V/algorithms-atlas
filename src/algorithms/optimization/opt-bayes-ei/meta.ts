// 贝叶斯优化 EI · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-bayes-ei',
  categoryId: 'optimization',
  title: { zh: '贝叶斯优化 EI', en: 'Bayesian Optimization EI' },
  summary: {
    zh: 'EI 采集函数：最大化期望改进 E[max(f−f*, 0)]。',
    en: 'EI acquisition: maximize expected improvement E[max(f−f*, 0)].',
  },
  description: {
    zh: '贝叶斯优化采集函数 Expected Improvement：在代理模型（高斯过程简化版）的预测均值 μ 与方差 σ² 上选下一个采样点。',
    en: 'Bayesian optimization acquisition Expected Improvement: pick the next sample point from surrogate model (simplified GP) predictions μ and variance σ².',
  },
  tags: ['optimization', 'bayesian', 'black-box'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
