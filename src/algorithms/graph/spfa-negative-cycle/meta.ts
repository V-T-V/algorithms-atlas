// SPFA Negative Cycle · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'spfa-negative-cycle',
  categoryId: 'graph',
  title: { zh: 'SPFA 负环检测', en: 'SPFA Negative Cycle Detection' },
  summary: {
    zh: 'SPFA 队列优化 Bellman-Ford，检测负权环。',
    en: 'SPFA (queue-based Bellman-Ford) to detect negative-weight cycles.',
  },
  description: {
    zh: 'SPFA 维护一个队列，仅当某点距离被松弛时才重新入队。统计每个点的入队次数：若某点入队次数 >= V，则图中存在从源点可达的负环（或全图负环，使用超级源点）。本实现用超级源点连接所有节点，可检测全图任意负环。时间最坏 O(VE)。',
    en: 'SPFA keeps a queue, re-enqueuing a vertex only when its distance improves. Count enqueue times; if any vertex is enqueued >= V times, a negative cycle reachable from the source exists. We add a super-source connected to all vertices to detect any negative cycle in the whole graph. Worst-case O(VE).',
  },
  tags: ['graph', 'shortest-path', 'spfa', 'bellman-ford', 'negative-cycle'],
  complexity: { time: 'O(VE)', space: 'O(V+E)' },
};
