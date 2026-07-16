// Marsaglia 极坐标法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-marsaglia-normal',
  categoryId: 'randomized',
  title: { zh: 'Marsaglia 极坐标法', en: 'Marsaglia Polar Normal' },
  summary: {
    zh: '用 Marsaglia 极坐标法产生正态分布。',
    en: 'Generate normal samples via Marsaglia polar method.',
  },
  description: { zh: '无需三角函数，拒绝采样。', en: 'No trig; rejection sampling.' },
  tags: ['randomized', 'distribution', 'normal'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
