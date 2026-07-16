// 0-1 BFS · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'zero-one-bfs',
  categoryId: 'graph',
  title: { zh: '0-1 BFS', en: '0-1 BFS' },
  summary: {
    zh: '0-1 BFS属于graph类别。',
    en: '0-1 BFS is a graph algorithm.',
  },
  description: {
    zh: '0-1 BFS（0-1 BFS）属于graph类别的算法。',
    en: '0-1 BFS is an algorithm in the graph category.',
  },
  tags: ["graph","bfs","traversal"],
  complexity: { time: 'O(V + E)', space: 'O(V + E)' },
};
