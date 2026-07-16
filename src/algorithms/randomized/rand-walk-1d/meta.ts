// 一维随机游走 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-walk-1d',
  categoryId: 'randomized',
  title: { zh: '一维随机游走', en: '1D Random Walk' },
  summary: { zh: '一维对称随机游走。', en: '1D symmetric random walk.' },
  description: { zh: '每步 +1/-1 等概率。', en: 'Each step +1/-1 with equal probability.' },
  tags: ['randomized', 'simulation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
