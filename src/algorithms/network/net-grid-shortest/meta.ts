// 网格最短路径 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-grid-shortest',
  categoryId: 'network',
  title: { zh: '网格最短路径', en: 'Shortest Path in Binary Grid' },
  summary: {
    zh: '八方向网格从左上到右下最短路径长度。',
    en: '8-direction shortest path from top-left to bottom-right.',
  },
  description: { zh: 'BFS，每步八方向。', en: 'BFS 8-dir. O(R*C).' },
  tags: ['network', 'grid', 'bfs'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
