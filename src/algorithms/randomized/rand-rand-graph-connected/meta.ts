// 随机化图连通性 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-rand-graph-connected',
  categoryId: 'randomized',
  title: { zh: '随机化图连通性', en: 'Randomized Graph Connectivity' },
  summary: { zh: '随机游走估计图连通性。', en: 'Estimate graph connectivity via random walks.' },
  description: {
    zh: '多次随机游走统计可达顶点比例。',
    en: 'Multiple random walks; estimate reachable fraction.',
  },
  tags: ['randomized', 'graph'],
  complexity: { time: 'O(walks·L)', space: 'O(V)' },
};
