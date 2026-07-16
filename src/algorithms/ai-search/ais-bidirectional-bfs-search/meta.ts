// 双向 BFS 搜索（Bidirectional BFS Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-bidirectional-bfs-search',
  categoryId: 'ai-search',
  title: { zh: '双向 BFS 搜索', en: 'Bidirectional BFS Search' },
  summary: { zh: '从源和汇同时 BFS 在中间相会。', en: 'BFS from both ends, meet in the middle.' },
  description: {
    zh: '双向 BFS 从起点和终点交替扩展，当两个前沿相遇即得最短路径，复杂度从 O(b^d) 降到 O(b^(d/2))。',
    en: 'Bidirectional BFS alternates expanding from start and goal; meeting frontiers yield shortest path, reducing cost to O(b^(d/2)).',
  },
  tags: ['ai-search', 'bidirectional', 'bfs'],
  complexity: { time: 'O(b^(d/2))', space: 'O(b^(d/2))' },
};
