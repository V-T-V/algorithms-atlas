// 二维随机游走 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-walk-2d',
  categoryId: 'randomized',
  title: { zh: '二维随机游走', en: '2D Random Walk' },
  summary: { zh: '二维格点随机游走。', en: '2D lattice random walk.' },
  description: { zh: '每步上下左右等概率。', en: 'Each step N/S/E/W with equal probability.' },
  tags: ['randomized', 'simulation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
