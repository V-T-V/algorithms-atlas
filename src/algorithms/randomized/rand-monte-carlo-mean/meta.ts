// 蒙特卡洛均值估计 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-monte-carlo-mean',
  categoryId: 'randomized',
  title: { zh: '蒙特卡洛均值估计', en: 'Monte Carlo Mean Estimation' },
  summary: {
    zh: '用随机样本估计函数期望。',
    en: 'Estimate expectation of a function via random samples.',
  },
  description: { zh: 'E[f] ≈ (1/n)Σf(xᵢ)，xᵢ~U(a,b)。', en: 'E[f] ≈ (1/n)Σf(xᵢ), xᵢ~U(a,b).' },
  tags: ['randomized', 'monte-carlo'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
