import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-floyd-3',
  categoryId: 'graph',
  title: { zh: 'Floyd-Warshall（全源最短路）', en: 'Floyd-Warshall (All-Pairs Shortest Path)' },
  summary: {
    zh: '动态规划求出所有节点对之间的最短路，支持负权（无负环）。',
    en: 'DP-based all-pairs shortest paths; tolerates negative edges (no negative cycles).',
  },
  description: {
    zh: '枚举中转点 k，对每对 (i,j)：dist[i][j]=min(dist[i][j], dist[i][k]+dist[k][j])。三重循环 O(n³)。',
    en: 'For each intermediate k, for each (i,j): dist[i][j]=min(dist[i][j], dist[i][k]+dist[k][j]). O(n³).',
  },
  tags: ['graph', 'all-pairs', 'shortest-path'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
