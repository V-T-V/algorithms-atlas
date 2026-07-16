// 指数分布采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-exp-sample',
  categoryId: 'randomized',
  title: { zh: '指数分布采样', en: 'Exponential Sampling' },
  summary: { zh: '用逆变换产生指数分布。', en: 'Sample exponential via inverse transform.' },
  description: { zh: 'x = -ln(u)/λ。', en: 'x = -ln(u)/λ.' },
  tags: ['randomized', 'distribution', 'exponential'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
