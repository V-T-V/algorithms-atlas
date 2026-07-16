// 城市阈值距离 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-city-threshold',
  categoryId: 'network',
  title: { zh: '城市阈值距离', en: 'City With Threshold Distance' },
  summary: {
    zh: '在距离阈值内邻居最少的城市编号。',
    en: 'City with fewest reachable neighbors within distance threshold.',
  },
  description: { zh: 'Floyd 全源最短路后统计。', en: 'Floyd all-pairs then count. O(V^3).' },
  tags: ['network', 'graph', 'all-pairs'],
  complexity: { time: 'O(V^3)', space: 'O(V^2)' },
};
