// 坐标下降（Coordinate Descent）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-coordinate-descent',
  categoryId: 'optimization',
  title: { zh: '坐标下降', en: 'Coordinate Descent' },
  summary: {
    zh: '每次只沿一个坐标方向线搜索，循环至收敛，适合可分目标。',
    en: 'Line-search one coordinate at a time, cycle until convergence; suits separable objectives.',
  },
  description: {
    zh: '坐标下降：固定其他维，沿第 i 维精确/近似线搜索极小化，轮换所有维度。',
    en: 'Coordinate descent: fix other dims, minimize along dimension i via line search; cycle all dims.',
  },
  tags: ['optimization', 'gradient-free'],
  complexity: { time: 'O(k·n)', space: 'O(n)' },
};
