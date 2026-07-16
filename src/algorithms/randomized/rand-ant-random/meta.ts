// 随机蚂蚁行走 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-ant-random',
  categoryId: 'randomized',
  title: { zh: '随机蚂蚁行走', en: 'Random Ant Walk' },
  summary: { zh: '蚂蚁在网格上随机行走。', en: 'Ant random walk on a grid.' },
  description: { zh: '每步随机选方向前进。', en: 'Each step a random direction.' },
  tags: ['randomized', 'simulation'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
