// BFS Bipartite · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bfs-bipartite',
  categoryId: 'graph',
  title: { zh: '二分图判定·BFS 染色', en: 'Bipartite Check (BFS Coloring)' },
  summary: {
    zh: 'BFS 交替染 0/1 两色判定二分图。',
    en: 'BFS alternating 0/1 coloring to test bipartiteness.',
  },
  description: {
    zh: '从每个未染色节点出发 BFS，染 0 色，其邻居染 1 色，交替进行。若某邻居已染色且与当前同色，则存在奇环，非二分图。无奇环的图都是二分图。时间 O(V+E)。',
    en: 'BFS from each uncolored vertex, coloring it 0, neighbors 1, alternating. If a neighbor is already the same color as current, an odd cycle exists and the graph is not bipartite. Time O(V+E).',
  },
  tags: ['graph', 'bipartite', 'bfs', 'coloring', 'undirected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
