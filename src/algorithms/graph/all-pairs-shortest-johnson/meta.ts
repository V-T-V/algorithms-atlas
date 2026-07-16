import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'all-pairs-shortest-johnson',
  categoryId: 'graph',
  title: { zh: '全源最短路（含路径）', en: 'All-Pairs Shortest Path (with Path)' },
  summary: {
    zh: 'Floyd-Warshall 三重循环 + next 表，重建任意两点最短路径。',
    en: 'Floyd-Warshall triple loop plus a next table to rebuild shortest paths.',
  },
  description: {
    zh: '本算法用 Floyd-Warshall 求出图中所有顶点对之间的最短距离，并同时维护后继表 next：当 dist[i][j] 经由 k 改进时记录 next[i][j] = next[i][k]。重建路径时从 i 出发，反复跳到 next 直至到达 j，得到节点序列。算法还能通过 dist[i][i] < 0 检测负环。时间 O(V³)，空间 O(V²)。',
    en: 'This algorithm runs Floyd-Warshall to compute shortest distances between all vertex pairs while maintaining a successor table next: when dist[i][j] improves via k, set next[i][j] = next[i][k]. Path reconstruction hops along next from i to j. It also detects negative cycles via dist[i][i] < 0. Time O(V³), space O(V²).',
  },
  tags: ['graph', 'shortest-path', 'floyd-warshall', 'all-pairs', 'dynamic-programming'],
  complexity: { time: 'O(V³)', space: 'O(V²)' },
};
