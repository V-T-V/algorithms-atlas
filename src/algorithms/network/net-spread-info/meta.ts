// 信息传播 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-spread-info',
  categoryId: 'network',
  title: { zh: '信息传播', en: 'Information Spread' },
  summary: {
    zh: '从多个源点出发，求所有节点最近源的距离。',
    en: 'Multi-source BFS: nearest source distance for each node.',
  },
  description: { zh: '所有源同时入队 BFS。', en: 'All sources in queue, BFS. O(V+E).' },
  tags: ['network', 'graph', 'multi-bfs'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
