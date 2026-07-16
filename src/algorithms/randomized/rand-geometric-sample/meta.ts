// 几何分布采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-geometric-sample',
  categoryId: 'randomized',
  title: { zh: '几何分布采样', en: 'Geometric Sampling' },
  summary: {
    zh: '逆变换法产生几何分布。',
    en: 'Sample geometric distribution via inverse transform.',
  },
  description: { zh: '失败次数直到首次成功。', en: 'Failures before first success.' },
  tags: ['randomized', 'distribution', 'geometric'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
