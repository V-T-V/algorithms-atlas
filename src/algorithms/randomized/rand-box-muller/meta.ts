// Box-Muller 正态采样 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-box-muller',
  categoryId: 'randomized',
  title: { zh: 'Box-Muller 正态采样', en: 'Box-Muller Normal Sampling' },
  summary: {
    zh: '用 Box-Muller 变换产生正态分布。',
    en: 'Generate normal samples via Box-Muller transform.',
  },
  description: { zh: 'z = √(-2 ln u₁) cos(2π u₂)。', en: 'z = √(-2 ln u₁) cos(2π u₂).' },
  tags: ['randomized', 'distribution', 'normal'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
