// Floyd-Warshall · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-floyd-warshall',
  categoryId: 'network',
  title: { zh: 'Floyd-Warshall', en: 'Floyd-Warshall' },
  summary: {
    zh: '动态规划求全源最短路，支持负权。',
    en: 'All-pairs shortest path via DP; supports negative weights.',
  },
  description: {
    zh: '枚举中转点 k：dist[i][j] = min(dist[i][j], dist[i][k]+dist[k][j])。',
    en: 'Triple loop over k. O(V^3).',
  },
  tags: ['network', 'graph', 'all-pairs'],
  complexity: { time: 'O(V^3)', space: 'O(V^2)' },
};
