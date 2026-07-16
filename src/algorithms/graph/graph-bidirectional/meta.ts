import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-bidirectional',
  categoryId: 'graph',
  title: { zh: '双向 BFS', en: 'Bidirectional BFS' },
  summary: {
    zh: '从源和目标同时 BFS，相遇即得无权图最短路。',
    en: 'BFS from both source and target; meet-in-the-middle yields the shortest path.',
  },
  description: {
    zh: '双向 BFS。在无权图上从 source 与 target 同时广度优先搜索，当两棵搜索树相遇（某节点被两边都访问到）即得最短路。每次扩展节点数较小的那一侧（均衡启发），可显著降低搜索量。设相遇点 mu，距离 dist[source][mu]+dist[target][mu]。时间 O(b^(d/2))，空间 O(b^(d/2))。',
    en: 'Bidirectional BFS on unweighted graph. Expand the smaller frontier each step. On meeting, sum the two distances. Time/space O(b^(d/2)).',
  },
  tags: ['graph', 'bfs', 'shortest-path', 'bidirectional'],
  complexity: { time: 'O(b^(d/2))', space: 'O(b^(d/2))' },
};
