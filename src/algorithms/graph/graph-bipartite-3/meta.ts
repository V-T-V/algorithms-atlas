import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bipartite-3',
  categoryId: 'graph',
  title: { zh: '二分图判定（BFS 染色）', en: 'Bipartite Check (BFS Coloring)' },
  summary: {
    zh: 'BFS 给每个节点染色，相邻必须异色，遇冲突即非二分图。',
    en: 'BFS-assign colors such that adjacent vertices differ; conflict means not bipartite.',
  },
  description: {
    zh: '从每个未染色节点出发 BFS，染 0/1。若邻居已有同色则非二分图。可顺带输出二分划分解。',
    en: 'From each uncolored vertex BFS, alternate 0/1; same-color neighbor means not bipartite. Yields the two parts.',
  },
  tags: ['graph', 'bipartite', 'coloring', 'bfs'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
